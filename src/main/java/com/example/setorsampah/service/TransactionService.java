package com.example.setorsampah.service;

import java.util.List;

import com.example.setorsampah.dto.TransactionRequest;
import com.example.setorsampah.dto.TransactionResponse;

public interface TransactionService {
    TransactionResponse createTransaction(TransactionRequest request);
    List<TransactionResponse> getAllTransactions();
    TransactionResponse getTransactionById(Long id);
    List<TransactionResponse> getTransactionsByUserId(Long userId);
    List<TransactionResponse> getTransactionsByBankId(Long bankId);
}
