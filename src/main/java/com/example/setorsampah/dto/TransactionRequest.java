package com.example.setorsampah.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {
    private Long userId;
    private Long bankId;
    private List<TransactionRequestItem> items;
}
