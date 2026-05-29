package com.example.setorsampah.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.setorsampah.model.User;
import com.example.setorsampah.model.WasteBank;
import com.example.setorsampah.model.WasteTransaction;

@Repository
public interface WasteTransactionRepository extends JpaRepository<WasteTransaction, Long> {
    List<WasteTransaction> findByUser(User user);
    List<WasteTransaction> findByBank(WasteBank bank);
    Page<WasteTransaction> findByUser(User user, Pageable pageable);
    Page<WasteTransaction> findByBank(WasteBank bank, Pageable pageable);
    List<WasteTransaction> findByTransactionDateBetween(java.time.LocalDateTime startDate, java.time.LocalDateTime endDate);
}
