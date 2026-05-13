package com.example.setorsampah.mapper;

import com.example.setorsampah.dto.UserRequest;
import com.example.setorsampah.dto.UserResponse;
import com.example.setorsampah.model.User;

public class UserMapper {

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
        User user = new User();
        user.setNama(request.getNama());
        user.setAlamat(request.getAlamat());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
        user.setPoint(0.0);
        return user;
    }
}
