package com.lms.wallet.service;

import com.lms.auth.security.SecurityUtils;
import com.lms.wallet.dto.WalletResponse;
import com.lms.wallet.dto.WalletTransactionResponse;
import com.lms.wallet.entity.Wallet;
import com.lms.wallet.entity.WalletTransaction;
import com.lms.wallet.enums.PaymentAction;
import com.lms.wallet.repository.WalletRepository;
import com.lms.wallet.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final SecurityUtils securityUtils;

    public WalletResponse getMyWallet() {
        String userId = securityUtils.getCurrentUserId();
        Wallet wallet = getOrCreateWallet(userId);
        return mapWallet(wallet);
    }

    public List<WalletTransactionResponse> getMyTransactions() {
        String userId = securityUtils.getCurrentUserId();
        return walletTransactionRepository.findByUserIdOrderByDoneAtDesc(userId)
                .stream()
                .map(this::mapTransaction)
                .collect(Collectors.toList());
    }

    public Page<WalletTransactionResponse> getMyTransactionsPaged(int page, int size) {
        String userId = securityUtils.getCurrentUserId();
        PageRequest pageable = PageRequest.of(page, size);
        return walletTransactionRepository
                .findByUserIdOrderByDoneAtDesc(userId, pageable)
                .map(this::mapTransaction);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public WalletResponse creditForLoanSystem(
            String userId,
            String loanId,
            BigDecimal amount
    ) {
        Wallet wallet = getOrCreateWallet(userId);
        ensureActive(wallet);
        ensureAmount(amount);

        wallet.setBalance(wallet.getBalance().add(amount));
        wallet.setUpdatedAt(LocalDateTime.now());
        Wallet saved = walletRepository.save(wallet);

        createTransaction(saved, userId, loanId, amount, PaymentAction.CREDIT, null);
        log.info("CREDIT WALLET | userId={} loanId={} amount={}",
                userId, loanId, amount);
        log.info("WALLET BALANCE AFTER CREDIT = {}", saved.getBalance());
        return mapWallet(saved);
    }


    public WalletResponse creditForLoan(String loanId, BigDecimal amount) {
        String userId = securityUtils.getCurrentUserId();
        return creditForLoanSystem(userId, loanId, amount);
    }


    @Transactional
    public WalletResponse withdraw(String loanId, BigDecimal amount) {
        return withdraw(loanId, amount, null);
    }

    @Transactional
    public WalletResponse withdraw(String loanId, BigDecimal amount, String referenceId) {
        String userId = securityUtils.getCurrentUserId();
        Wallet wallet = getOrCreateWallet(userId);
        ensureActive(wallet);
        ensureAmount(amount);
        ensureSufficientBalance(wallet, amount);

        if (referenceId != null && !referenceId.isBlank()) {
            boolean alreadyProcessed =
                    walletTransactionRepository.existsByUserIdAndLoanIdAndActionAndReferenceId(
                            userId,
                            loanId,
                            PaymentAction.WITHDRAWN,
                            referenceId
                    );
            if (alreadyProcessed) {
                throw new RuntimeException("Duplicate repayment request already processed");
            }
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        wallet.setUpdatedAt(LocalDateTime.now());
        Wallet saved = walletRepository.save(wallet);

        createTransaction(saved, userId, loanId, amount, PaymentAction.WITHDRAWN, referenceId);
        return mapWallet(saved);
    }

    @Transactional
    public WalletResponse reimburse(String loanId, BigDecimal amount) {
        String userId = securityUtils.getCurrentUserId();
        Wallet wallet = getOrCreateWallet(userId);
        ensureActive(wallet);
        ensureAmount(amount);

        wallet.setBalance(wallet.getBalance().add(amount));
        wallet.setUpdatedAt(LocalDateTime.now());
        Wallet saved = walletRepository.save(wallet);

        createTransaction(saved, userId, loanId, amount, PaymentAction.REIMBURSEMENT, null);
        return mapWallet(saved);
    }

    public WalletResponse updateMyWalletStatus(boolean active) {
        String userId = securityUtils.getCurrentUserId();
        Wallet wallet = getOrCreateWallet(userId);
        wallet.setActive(active);
        wallet.setUpdatedAt(LocalDateTime.now());
        Wallet saved = walletRepository.save(wallet);
        return mapWallet(saved);
    }

    private Wallet getOrCreateWallet(String userId) {
        log.info("WALLET FETCH | userId={}", userId);
        return walletRepository.findByUserId(userId).orElseGet(() -> {
            Wallet wallet = Wallet.builder()
                    .userId(userId)
                    .balance(BigDecimal.ZERO)
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            return walletRepository.save(wallet);
        });
    }

    private void ensureActive(Wallet wallet) {
        if (!Boolean.TRUE.equals(wallet.getActive())) {
            throw new RuntimeException("Wallet is inactive");
        }
    }

    private void ensureAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be greater than zero");
        }
    }

    private void ensureSufficientBalance(Wallet wallet, BigDecimal amount) {
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient wallet balance");
        }
    }

    private void createTransaction(
            Wallet wallet,
            String userId,
            String loanId,
            BigDecimal amount,
            PaymentAction action,
            String referenceId
    ) {
        WalletTransaction tx = WalletTransaction.builder()
                .walletId(wallet.getId())
                .userId(userId)
                .loanId(loanId)
                .amount(amount)
                .action(action)
                .referenceId(referenceId)
                .doneAt(LocalDateTime.now())
                .build();
        walletTransactionRepository.save(tx);
    }

    private WalletResponse mapWallet(Wallet wallet) {
        return new WalletResponse(
                wallet.getId(),
                wallet.getUserId(),
                wallet.getBalance(),
                wallet.getActive(),
                wallet.getUpdatedAt()
        );
    }

    private WalletTransactionResponse mapTransaction(WalletTransaction tx) {
        return new WalletTransactionResponse(
                tx.getId(),
                tx.getWalletId(),
                tx.getUserId(),
                tx.getLoanId(),
                tx.getAmount(),
                tx.getAction(),
                tx.getDoneAt()
        );
    }
}
