package com.lms.wallet.controller;

import com.lms.wallet.dto.WalletCreditRequest;
import com.lms.wallet.dto.WalletReimburseRequest;
import com.lms.wallet.dto.WalletResponse;
import com.lms.wallet.dto.WalletStatusRequest;
import com.lms.wallet.dto.WalletTransactionResponse;
import com.lms.wallet.dto.WalletWithdrawRequest;
import com.lms.wallet.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/me")
    public ResponseEntity<WalletResponse> getMyWallet() {
        return ResponseEntity.ok(walletService.getMyWallet());
    }

    @GetMapping("/me/transactions")
    public ResponseEntity<List<WalletTransactionResponse>> getMyTransactions() {
        return ResponseEntity.ok(walletService.getMyTransactions());
    }

    @GetMapping("/me/transactions/paged")
    public ResponseEntity<Page<WalletTransactionResponse>> getMyTransactionsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(walletService.getMyTransactionsPaged(page, size));
    }

    @PostMapping("/credit")
    public ResponseEntity<WalletResponse> credit(@RequestBody @Valid WalletCreditRequest request) {
        return ResponseEntity.ok(walletService.creditForLoan(request.getLoanId(), request.getAmount()));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<WalletResponse> withdraw(@RequestBody @Valid WalletWithdrawRequest request) {
        return ResponseEntity.ok(walletService.withdraw(request.getLoanId(), request.getAmount()));
    }

    @PostMapping("/reimburse")
    public ResponseEntity<WalletResponse> reimburse(@RequestBody @Valid WalletReimburseRequest request) {
        return ResponseEntity.ok(walletService.reimburse(request.getLoanId(), request.getAmount()));
    }

    @PutMapping("/me/status")
    public ResponseEntity<WalletResponse> updateStatus(@RequestBody @Valid WalletStatusRequest request) {
        return ResponseEntity.ok(walletService.updateMyWalletStatus(request.getActive()));
    }
}
