package com.example.setorsampah.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.setorsampah.dto.ApiResponse;
import com.example.setorsampah.dto.TransactionRequest;
import com.example.setorsampah.dto.TransactionResponse;
import com.example.setorsampah.service.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Validated
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<ApiResponse<TransactionResponse>> createTransaction(@Valid @RequestBody TransactionRequest request) {
        return new ResponseEntity<>(ApiResponse.success(transactionService.createTransaction(request), "Transaksi berhasil dibuat"), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getAllTransactions() {
        return ResponseEntity.ok(ApiResponse.success(transactionService.getAllTransactions(), "Daftar transaksi berhasil diambil"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(transactionService.getTransactionById(id), "Transaksi ditemukan"));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getTransactionsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(transactionService.getTransactionsByUserId(userId), "Daftar transaksi user berhasil diambil"));
    }

    @GetMapping("/banks/{bankId}")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getTransactionsByBank(@PathVariable Long bankId) {
        return ResponseEntity.ok(ApiResponse.success(transactionService.getTransactionsByBankId(bankId), "Daftar transaksi bank berhasil diambil"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Transaksi berhasil dihapus"));
    }
}
