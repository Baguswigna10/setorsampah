package com.example.setorsampah.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponseItem {
    private Long categoryId;
    private String categoryName;
    private Double weight;
    private Double point;
}
