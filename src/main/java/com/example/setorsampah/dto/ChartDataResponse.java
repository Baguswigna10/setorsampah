package com.example.setorsampah.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChartDataResponse {
    private String label;
    private Double weight;
    private Double points;
}
