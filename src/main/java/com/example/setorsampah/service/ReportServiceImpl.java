package com.example.setorsampah.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.setorsampah.dto.TotalWasteReportDto;
import com.example.setorsampah.dto.WasteCategoryReportDto;
import com.example.setorsampah.repository.WasteTransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private final WasteTransactionRepository transactionRepository;

    @Override
    public TotalWasteReportDto getTotalWasteReport() {
        // 1. Hitung total transaksi, berat, dan poin
        long totalTransactions = transactionRepository.count();
        
        // Inisialisasi dengan 0.0 jika tidak ada transaksi
        double totalWeight = 0.0;
        double totalPoints = 0.0;
        
        // Jika ada transaksi, hitung dari database
        if (totalTransactions > 0) {
            totalWeight = transactionRepository.findAll().stream()
                    .mapToDouble(tx -> tx.getTotalWeight() != null ? tx.getTotalWeight() : 0.0)
                    .sum();
            
            totalPoints = transactionRepository.findAll().stream()
                    .mapToDouble(tx -> tx.getTotalPoint() != null ? tx.getTotalPoint() : 0.0)
                    .sum();
        }

        // 2. Ambil breakdown per kategori menggunakan native query
        List<Object[]> categoryResults = transactionRepository.getTotalWeightByCategory();
        List<WasteCategoryReportDto> categories = new ArrayList<>();
        
        for (Object[] row : categoryResults) {
            WasteCategoryReportDto category = new WasteCategoryReportDto(
                    ((Number) row[0]).longValue(),           // categoryId
                    (String) row[1],                          // categoryName
                    ((Number) row[2]).doubleValue()          // totalWeight
            );
            categories.add(category);
        }

        // 3. Buat dan kembalikan response
        return TotalWasteReportDto.builder()
                .totalTransactions(totalTransactions)
                .totalWeight(totalWeight)
                .totalPoints(totalPoints)
                .categories(categories)
                .build();
    }
}
