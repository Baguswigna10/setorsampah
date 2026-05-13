package com.example.setorsampah.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.setorsampah.dto.UserRequest;
import com.example.setorsampah.dto.UserResponse;
import com.example.setorsampah.mapper.UserMapper;
import com.example.setorsampah.model.User;
import com.example.setorsampah.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public Page<UserResponse> getUsers(Pageable pageable, String search) {
        if (search == null || search.isBlank()) {
            return userRepository.findAll(pageable).map(UserMapper::toResponse);
        }
        return userRepository.findByNamaContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable)
                .map(UserMapper::toResponse);
    }

    @Override
    public UserResponse getUserById(Long id) {
        return userRepository.findById(id)
                .map(UserMapper::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User tidak ditemukan"));
    }

    @Override
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email sudah terdaftar");
        }
        User user = UserMapper.toEntity(request);
        return UserMapper.toResponse(userRepository.save(user));
    }

    @Override
    public UserResponse updateUser(Long id, UserRequest request) {
        return userRepository.findById(id).map(user -> {
            if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email sudah terdaftar");
            }
            user.setNama(request.getNama());
            user.setAlamat(request.getAlamat());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());
            user.setRole(request.getRole());
            return UserMapper.toResponse(userRepository.save(user));
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User tidak ditemukan"));
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User tidak ditemukan");
        }
        userRepository.deleteById(id);
    }
}
