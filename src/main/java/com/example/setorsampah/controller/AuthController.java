package com.example.setorsampah.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.setorsampah.dto.ApiResponse;
import com.example.setorsampah.dto.LoginRequest;
import com.example.setorsampah.dto.RegisterRequest;
import com.example.setorsampah.model.User;
import com.example.setorsampah.repository.UserRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<User>> login(@Valid @RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Simple plain text password check for simulation (In real app, use BCrypt)
            if (user.getPassword().equals(request.getPassword())) {
                return ResponseEntity.ok(ApiResponse.success(user, "Login berhasil"));
            }
        }
        
        return ResponseEntity.badRequest().body(ApiResponse.error("Email atau kata sandi salah"));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@Valid @RequestBody RegisterRequest request) {
        // Check if email already exists
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email sudah terdaftar"));
        }

        User user = new User();
        user.setNama(request.getNama());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setAlamat(request.getAlamat());
        user.setRole("USER");
        user.setPoint(0.0);

        User savedUser = userRepository.save(user);
        return new ResponseEntity<>(ApiResponse.success(savedUser, "Registrasi berhasil"), HttpStatus.CREATED);
    }
}
