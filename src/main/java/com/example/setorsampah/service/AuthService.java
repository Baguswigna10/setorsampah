package com.example.setorsampah.service;

import com.example.setorsampah.dto.LoginRequest;
import com.example.setorsampah.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}
