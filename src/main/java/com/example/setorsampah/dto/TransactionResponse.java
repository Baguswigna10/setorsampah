package com.example.setorsampah.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long transactionId;
    private Long userId;
    private Long bankId;
    private Double totalWeight;
    private Double totalPoint;
    private LocalDateTime transactionDate;
    private List<TransactionResponseItem> items;
}
