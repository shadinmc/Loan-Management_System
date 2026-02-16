package com.lms.disbursement.controller;

import com.lms.common.enums.LoanStatus;
import com.lms.disbursement.dto.DisbursementPageResponse;
import com.lms.disbursement.dto.DisbursementResponse;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.wallet.entity.WalletTransaction;
import com.lms.wallet.enums.PaymentAction;
import com.lms.wallet.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/disbursements")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('BRANCH_MANAGER','REGIONAL_MANAGER')")
public class DisbursementController {

    private final LoanRepository loanRepository;
    private final WalletTransactionRepository walletTransactionRepository;

    @GetMapping
    public DisbursementPageResponse getDisbursementQueue(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        List<Loan> loans = loanRepository.findByStatusIn(
                List.of(
                        LoanStatus.DISBURSEMENT_PENDING,
                        LoanStatus.DISBURSED,
                        LoanStatus.ACTIVE,
                        LoanStatus.CLOSED
                )
        );

        if (loans.isEmpty()) {
            return toPage(List.of(), page, size);
        }

        List<String> loanIds = loans.stream()
                .map(Loan::getLoanId)
                .toList();

        Map<String, WalletTransaction> latestCreditTxByLoanId =
                walletTransactionRepository
                        .findByLoanIdInAndActionOrderByDoneAtDesc(loanIds, PaymentAction.CREDIT)
                        .stream()
                        .collect(Collectors.toMap(
                                WalletTransaction::getLoanId,
                                Function.identity(),
                                (existing, ignored) -> existing
                        ));

        List<DisbursementResponse> sorted = loans.stream()
                .sorted(Comparator.comparing(Loan::getUpdatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .map(loan -> {
                    WalletTransaction tx = latestCreditTxByLoanId.get(loan.getLoanId());
                    return new DisbursementResponse(
                            loan.getLoanId(),
                            loan.getUserId(),
                            loan.getApprovedAmount() != null ? loan.getApprovedAmount() : loan.getLoanAmount(),
                            loan.getStatus(),
                            loan.getDisbursementScheduledAt(),
                            loan.getDisbursedAt(),
                            loan.getUpdatedAt(),
                            tx != null ? tx.getId() : loan.getTransactionId(),
                            tx != null ? tx.getDoneAt() : null
                    );
                })
                .toList();

        return toPage(sorted, page, size);
    }

    private DisbursementPageResponse toPage(
            List<DisbursementResponse> items,
            int page,
            int size
    ) {
        int safeSize = Math.max(size, 1);
        int safePage = Math.max(page, 0);
        int fromIndex = Math.min(safePage * safeSize, items.size());
        int toIndex = Math.min(fromIndex + safeSize, items.size());
        List<DisbursementResponse> content = items.subList(fromIndex, toIndex);
        int totalPages = (int) Math.ceil(items.size() / (double) safeSize);

        return new DisbursementPageResponse(
                content,
                safePage,
                safeSize,
                items.size(),
                totalPages,
                safePage == 0,
                totalPages == 0 || safePage >= totalPages - 1
        );
    }
}
