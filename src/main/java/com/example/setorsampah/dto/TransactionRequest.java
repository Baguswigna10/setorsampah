package com.example.setorsampah.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {
    @NotNull(message = "User ID tidak boleh kosong")
    private Long userId;

    @NotNull(message = "Bank ID tidak boleh kosong")
    private Long bankId;

    @NotEmpty(message = "Daftar item transaksi tidak boleh kosong")
    @Valid
    private List<TransactionRequestItem> items;
}
