package com.example.setorsampah.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.setorsampah.dto.ApiResponse;
import com.example.setorsampah.dto.RewardRequest;
import com.example.setorsampah.dto.RewardResponse;
import com.example.setorsampah.service.RewardService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
@Validated
public class RewardController {

    private final RewardService rewardService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RewardResponse>>> getAllRewards() {
        return ResponseEntity.ok(ApiResponse.success(rewardService.getAllRewards(), "Daftar reward berhasil diambil"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RewardResponse>> getRewardById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(rewardService.getRewardById(id), "Reward ditemukan"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RewardResponse>> createReward(@Valid @RequestBody RewardRequest request) {
        return new ResponseEntity<>(ApiResponse.success(rewardService.createReward(request), "Reward berhasil dibuat"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RewardResponse>> updateReward(@PathVariable Long id, @Valid @RequestBody RewardRequest request) {
        return ResponseEntity.ok(ApiResponse.success(rewardService.updateReward(id, request), "Reward berhasil diperbarui"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReward(@PathVariable Long id) {
        rewardService.deleteReward(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Reward berhasil dihapus"));
    }
}
