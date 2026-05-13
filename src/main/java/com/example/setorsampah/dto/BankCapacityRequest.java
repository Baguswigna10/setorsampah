package com.example.setorsampah.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankCapacityRequest {
    @NotNull(message = "Kategori sampah tidak boleh kosong")
    private Long categoryId;

    @NotNull(message = "Kapasitas maksimum tidak boleh kosong")
    @Positive(message = "Kapasitas maksimum harus lebih besar dari nol")
    private Double maxCapacity;
}
