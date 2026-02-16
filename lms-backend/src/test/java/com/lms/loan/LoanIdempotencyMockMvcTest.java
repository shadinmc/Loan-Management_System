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
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class LoanIdempotencyMockMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @MockitoBean
    private SecurityUtils securityUtils;

    @MockitoBean
    private KycService kycService;

    // ✅ FIX: manually create ObjectMapper
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final AtomicReference<User> currentUser = new AtomicReference<>();

    @BeforeEach
    void setUp() {
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
    void postLoan_sameKeyDifferentUser_internalServerError() throws Exception {
        LoanApplicationRequest request = buildPersonalRequest(50000);
        String body = objectMapper.writeValueAsString(request);

        // First user
        mockMvc.perform(
                        post("/api/loans/apply")
                                .header("X-Idempotency-Key", "abc-123")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(body)
                )
                .andExpect(status().isCreated());

        // Switch user
        currentUser.set(buildUser("user-2"));

        // Same idempotency key → repository returns multiple rows → 500
        mockMvc.perform(
                        post("/api/loans/apply")
                                .header("X-Idempotency-Key", "abc-123")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(body)
                )
                .andExpect(status().isInternalServerError());
    }


    private LoanApplicationRequest buildPersonalRequest(double income) {
        LoanApplicationRequest request = new LoanApplicationRequest();
        request.setLoanType(LoanType.PERSONAL);
        request.setLoanAmount(100000.0);
        request.setTenureMonths(12);

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
