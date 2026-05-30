package com.example.setorsampah.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TotalWasteReportDto {
    private Long totalTransactions;
    private Double totalWeight;
    private Double totalPoints;
    private List<WasteCategoryReportDto> categories;
}
