package com.lms.disbursement;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.common.enums.LoanStatus;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class DisbursementControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private LoanRepository loanRepository;

    @Test
    @WithMockUser(roles = "REGIONAL_MANAGER")
    void getDisbursementQueue_returnsPendingAndDisbursed() throws Exception {

        // GIVEN
        when(loanRepository.findByStatusIn(anyList()))
                .thenReturn(List.of(
                        buildLoan("LN-3001", LoanStatus.DISBURSEMENT_PENDING),
                        buildLoan("LN-3002", LoanStatus.DISBURSED)
                ));

        // WHEN
        String response = mockMvc.perform(get("/api/disbursements"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // THEN
        JsonNode root = objectMapper.readTree(response);
        Set<String> loanIds = new HashSet<>();

        root.forEach(node -> {
            loanIds.add(node.get("loanId").asText());
            assertThat(node.get("status").asText())
                    .isIn(
                            LoanStatus.DISBURSEMENT_PENDING.name(),
                            LoanStatus.DISBURSED.name()
                    );
        });

        assertThat(loanIds)
                .containsExactlyInAnyOrder("LN-3001", "LN-3002");
    }

    private Loan buildLoan(String loanId, LoanStatus status) {
        return Loan.builder()
                .loanId(loanId)
                .userId("user-" + loanId)
                .status(status)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }
}
