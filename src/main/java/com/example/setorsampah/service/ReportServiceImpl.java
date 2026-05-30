package com.example.setorsampah.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.setorsampah.dto.TotalWasteReportDto;
import com.example.setorsampah.model.WasteType;
import com.example.setorsampah.repository.WasteTransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private final WasteTransactionRepository transactionRepository;

    @Override
    public TotalWasteReportDto getTotalWasteReport() {
        double organik = getWeightByType(WasteType.ORGANIK);
        double anorganik = getWeightByType(WasteType.ANORGANIK);
        double b3 = getWeightByType(WasteType.B3);
        double total = organik + anorganik + b3;

        return TotalWasteReportDto.builder()
                .organik(organik)
                .anorganik(anorganik)
                .b3(b3)
                .total(total)
                .build();
    }

    private double getWeightByType(WasteType wasteType) {
        Double weight = transactionRepository.sumWeightByWasteType(wasteType);
        return weight != null ? weight : 0.0;
    }
}
