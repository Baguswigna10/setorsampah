package com.example.setorsampah.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
    
    // Agregasi per kategori untuk laporan total sampah
    @Query(value = "SELECT " +
            "wc.id as categoryId, " +
            "wc.name as categoryName, " +
            "COALESCE(SUM(td.weight), 0.0) as totalWeight " +
            "FROM waste_categories wc " +
            "LEFT JOIN transaction_details td ON wc.id = td.category_id " +
            "GROUP BY wc.id, wc.name " +
            "ORDER BY wc.name", 
            nativeQuery = true)
    List<Object[]> getTotalWeightByCategory();
}
