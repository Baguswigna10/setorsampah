package com.example.setorsampah.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankCapacityResponse {
    private Long id;
    private Long bankId;
    private Long categoryId;
    private String categoryName;
    private Double maxCapacity;
    private Double usedCapacity;
    private Double availableCapacity;
}
