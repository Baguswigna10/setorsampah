package com.example.setorsampah.mapper;

import com.example.setorsampah.dto.UserRequest;
import com.example.setorsampah.dto.UserResponse;
import com.example.setorsampah.model.Admin;
import com.example.setorsampah.model.User;
import com.example.setorsampah.model.Warga;

public class UserMapper {

    private UserMapper() {
    }

    public static UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponse(user.getId(), user.getNama(), user.getAlamat(), user.getEmail(), user.getRole(), user.getPoint());
    }

    public static User toEntity(UserRequest request) {
        if (request == null) {
            return null;
        }
        User user = createUserByRole(request.getRole());
        user.setNama(request.getNama());
        user.setAlamat(request.getAlamat());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setPoint(0.0);
        return user;
    }

    public static User createUserByRole(String role) {
        if (role == null) {
            throw new IllegalArgumentException("Role tidak boleh kosong");
        }
        return switch (role.toUpperCase()) {
            case "ADMIN" -> new Admin();
            case "WARGA", "USER" -> new Warga();
            default -> throw new IllegalArgumentException("Role tidak valid: " + role);
        };
    }
}
