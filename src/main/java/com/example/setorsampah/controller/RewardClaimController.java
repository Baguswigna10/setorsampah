package com.example.setorsampah.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.setorsampah.dto.ApiResponse;
import com.example.setorsampah.dto.RewardClaimRequest;
import com.example.setorsampah.dto.RewardClaimResponse;
import com.example.setorsampah.service.RewardClaimService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
@Validated
public class RewardClaimController {

    private final RewardClaimService claimService;

    @PostMapping
    public ResponseEntity<ApiResponse<RewardClaimResponse>> claimReward(@Valid @RequestBody RewardClaimRequest request) {
        return new ResponseEntity<>(ApiResponse.success(claimService.claimReward(request), "Reward berhasil ditukar"), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<RewardClaimResponse>>> getClaimsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(claimService.getClaimsByUserId(userId), "Riwayat claim berhasil diambil"));
    }
}
