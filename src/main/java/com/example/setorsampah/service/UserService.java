package com.example.setorsampah.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.setorsampah.dto.UserRequest;
import com.example.setorsampah.dto.UserResponse;

public interface UserService {
    Page<UserResponse> getUsers(Pageable pageable, String search);
    UserResponse getUserById(Long id);
    UserResponse createUser(UserRequest request);
    UserResponse updateUser(Long id, UserRequest request);
    void deleteUser(Long id);
}

