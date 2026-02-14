package com.lms.loan;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.audit.entity.AuditSequence;
import com.lms.audit.repository.AuditLogRepository;
import com.lms.auth.security.SecurityUtils;
import com.lms.common.enums.LoanType;
import com.lms.kyc.service.KycService;
import com.lms.loan.dto.LoanApplicationRequest;
import com.lms.loan.dto.PersonalLoanDetailsDto;
import com.lms.loan.repository.LoanRepository;
import com.lms.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
class LoanIdempotencyMockMvcTest {

    @Autowired
    private WebApplicationContext webApplicationContext;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private AuditLogRepository auditLogRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    @MockBean
    private SecurityUtils securityUtils;
    @MockBean
    private KycService kycService;

    private MockMvc mockMvc;
    private final AtomicReference<User> currentUser = new AtomicReference<>();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        loanRepository.deleteAll();
        auditLogRepository.deleteAll();
        if (mongoTemplate.collectionExists(AuditSequence.class)) {
            mongoTemplate.dropCollection(AuditSequence.class);
        }

        currentUser.set(buildUser("user-1"));
        when(securityUtils.getCurrentUser()).thenAnswer(inv -> currentUser.get());
        when(securityUtils.getCurrentUserId()).thenAnswer(inv -> currentUser.get().getId());
        doNothing().when(kycService).validateKycVerified("user-1");
        doNothing().when(kycService).validateKycVerified("user-2");
        when(kycService.getCibilScore("user-1")).thenReturn(750);
        when(kycService.getCibilScore("user-2")).thenReturn(750);
    }

    @Test
    @WithMockUser(roles = "USER")
    void postLoan_sameKey_returnsSameLoanId() throws Exception {
        LoanApplicationRequest request = buildPersonalRequest(50000);
        String body = objectMapper.writeValueAsString(request);

        String response1 = mockMvc.perform(
                        post("/api/loans/apply")
                                .header("X-Idempotency-Key", "abc-123")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(body)
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String loanId1 = objectMapper.readTree(response1).get("loanId").asText();

        String response2 = mockMvc.perform(
                        post("/api/loans/apply")
                                .header("X-Idempotency-Key", "abc-123")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(body)
                )
                .andExpect(status().is2xxSuccessful())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String loanId2 = objectMapper.readTree(response2).get("loanId").asText();

        assertThat(loanId2).isEqualTo(loanId1);
        assertThat(loanRepository.count()).isEqualTo(1);
        assertThat(auditLogRepository.count()).isEqualTo(1);
    }

    @Test
    @WithMockUser(roles = "USER")
    void postLoan_sameKeyDifferentPrincipal_conflict() throws Exception {
        LoanApplicationRequest request = buildPersonalRequest(50000);
        String body = objectMapper.writeValueAsString(request);

        mockMvc.perform(
                        post("/api/loans/apply")
                                .header("X-Idempotency-Key", "abc-123")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(body)
                )
                .andExpect(status().isCreated());

        currentUser.set(buildUser("user-2"));

        mockMvc.perform(
                        post("/api/loans/apply")
                                .header("X-Idempotency-Key", "abc-123")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(body)
                )
                .andExpect(status().isConflict());
    }

    private LoanApplicationRequest buildPersonalRequest(double income) {
        LoanApplicationRequest request = new LoanApplicationRequest();
        request.setLoanType(LoanType.PERSONAL);
        request.setLoanAmount(100000.0);
        request.setTenureMonths(12);
        request.setInterestRate(12.5);
        request.setCibilScore(750);

        PersonalLoanDetailsDto details = new PersonalLoanDetailsDto();
        details.setEmploymentType("SALARIED");
        details.setMonthlyIncome(BigDecimal.valueOf(income));
        details.setEmployerName("ACME");
        details.setProofOfIdentity("aGVsbG8=");
        details.setProofOfIncome("aGVsbG8=");
        details.setProofOfAddress("aGVsbG8=");
        request.setPersonalLoanDetails(details);

        return request;
    }

    private User buildUser(String id) {
        User user = new User();
        user.setId(id);
        user.setEmail(id + "@example.com");
        user.setRoles(Set.of(User.Role.USER));
        return user;
    }
}
