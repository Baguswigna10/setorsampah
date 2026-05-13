package com.example.setorsampah.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WasteBankRequest {
    @NotBlank(message = "Nama bank sampah tidak boleh kosong")
    private String name;

    @NotBlank(message = "Alamat bank sampah tidak boleh kosong")
    private String address;
}
