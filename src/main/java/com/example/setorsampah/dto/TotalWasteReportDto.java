package com.example.setorsampah.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TotalWasteReportDto {
    private Double organik;
    private Double anorganik;
    private Double b3;
    private Double total;
}
