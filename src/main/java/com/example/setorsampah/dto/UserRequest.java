package com.example.setorsampah.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    @NotBlank(message = "Nama tidak boleh kosong")
    private String nama;

    @NotBlank(message = "Alamat tidak boleh kosong")
    private String alamat;

    @NotBlank(message = "Email tidak boleh kosong")
    @Email(message = "Email tidak valid")
    private String email;

    @NotBlank(message = "Password tidak boleh kosong")
    private String password;

    @NotBlank(message = "Role tidak boleh kosong")
    private String role;
}
