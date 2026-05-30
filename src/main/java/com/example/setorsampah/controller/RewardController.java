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
import com.example.setorsampah.dto.RewardClaimRequest;
import com.example.setorsampah.model.Reward;
import com.example.setorsampah.model.RewardClaim;
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
    public ResponseEntity<ApiResponse<List<Reward>>> getAllRewards() {
        return ResponseEntity.ok(ApiResponse.success(rewardService.getAllRewards(), "Daftar reward berhasil diambil"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Reward>> getRewardById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(rewardService.getRewardById(id), "Reward ditemukan"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Reward>> createReward(@Valid @RequestBody Reward reward) {
        return new ResponseEntity<>(ApiResponse.success(rewardService.createReward(reward), "Reward berhasil dibuat"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Reward>> updateReward(@PathVariable Long id, @Valid @RequestBody Reward reward) {
        return ResponseEntity.ok(ApiResponse.success(rewardService.updateReward(id, reward), "Reward berhasil diperbarui"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReward(@PathVariable Long id) {
        rewardService.deleteReward(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Reward berhasil dihapus"));
    }

    @PostMapping("/claim")
    public ResponseEntity<ApiResponse<RewardClaim>> claimReward(@Valid @RequestBody RewardClaimRequest request) {
        RewardClaim claim = rewardService.processClaim(request);
        return ResponseEntity.ok(ApiResponse.success(claim, "Reward berhasil diklaim"));
    }

    @GetMapping("/claims")
    public ResponseEntity<ApiResponse<List<RewardClaim>>> getAllClaims() {
        return ResponseEntity.ok(ApiResponse.success(rewardService.getAllClaims(), "Berhasil mengambil semua riwayat klaim"));
    }

    @GetMapping("/claims/users/{userId}")
    public ResponseEntity<ApiResponse<List<RewardClaim>>> getClaimsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(rewardService.getClaimsByUserId(userId), "Berhasil mengambil riwayat klaim user"));
    }

    @PostMapping("/claims/{id}/confirm")
    public ResponseEntity<ApiResponse<RewardClaim>> confirmClaim(@PathVariable Long id) {
        RewardClaim claim = rewardService.confirmClaim(id);
        return ResponseEntity.ok(ApiResponse.success(claim, "Klaim reward berhasil dikonfirmasi"));
    }
}
