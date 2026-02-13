package com.lms.cibil.service;

import com.lms.cibil.enums.CibilEventType;
import com.lms.kyc.entity.Kyc;
import com.lms.kyc.repository.KycRepository;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CibilScoreService {

    private final KycRepository kycRepository;

    private static final int MIN_SCORE = 300;
    private static final int MAX_SCORE = 900;

    public void applyEvent(String userId, CibilEventType event) {

        Kyc kyc = kycRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("KYC not found"));

        int score = kyc.getCibilScore();

        switch (event) {

            case EMI_PAID_ON_TIME -> score += 2;

            case EMI_OVERDUE -> score -= 5;

            case PENALTY_APPLIED -> score -= 3;

            case LOAN_CLOSED -> score += 10;

            case LOAN_CLOSED_OTS -> score += 5;
        }

        // Clamp score
        score = Math.max(MIN_SCORE, Math.min(MAX_SCORE, score));

        kyc.setCibilScore(score);
        kyc.setUpdatedAt(LocalDateTime.from(Instant.now()));

        kycRepository.save(kyc);
    }
}


