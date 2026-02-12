package com.lms.wallet.repository;

import com.lms.wallet.entity.WalletTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface WalletTransactionRepository extends MongoRepository<WalletTransaction, String> {
    List<WalletTransaction> findByUserIdOrderByDoneAtDesc(String userId);
    List<WalletTransaction> findByWalletIdOrderByDoneAtDesc(String walletId);

    Page<WalletTransaction> findByUserIdOrderByDoneAtDesc(String userId, Pageable pageable);
}
