package com.example.setorsampah.dto;

import com.example.setorsampah.model.WasteType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WasteCategoryRequest {
    @NotBlank(message = "Nama kategori tidak boleh kosong")
    private String name;

    @NotNull(message = "Poin per kg tidak boleh kosong")
    @Positive(message = "Poin per kg harus lebih besar dari nol")
    private Double pointPerKg;

    private String description;

    @NotNull(message = "Tipe sampah tidak boleh kosong")
    private WasteType wasteType;
}
