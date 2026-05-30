package com.example.setorsampah.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RewardRequest {

    @NotBlank(message = "Nama reward tidak boleh kosong")
    private String name;

    @NotNull(message = "Biaya poin tidak boleh kosong")
    @Positive(message = "Biaya poin harus lebih besar dari nol")
    private Double pointCost;

    @NotNull(message = "Stok tidak boleh kosong")
    @Positive(message = "Stok harus lebih besar dari nol")
    private Integer stock;
}
