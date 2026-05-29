package com.example.setorsampah.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.setorsampah.dto.ApiResponse;
import com.example.setorsampah.dto.RewardClaimRequest;
import com.example.setorsampah.model.Reward;
import com.example.setorsampah.model.RewardClaim;
import com.example.setorsampah.service.RewardService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Reward>>> getAllRewards() {
        return ResponseEntity.ok(ApiResponse.success(rewardService.getAllRewards(), "Berhasil mengambil daftar reward"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Reward>> createReward(@RequestBody Reward reward) {
        try {
            Reward createdReward = rewardService.createReward(reward);
            return ResponseEntity.ok(ApiResponse.success(createdReward, "Reward berhasil ditambahkan"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Reward>> updateReward(@PathVariable Long id, @RequestBody Reward reward) {
        try {
            Reward updatedReward = rewardService.updateReward(id, reward);
            return ResponseEntity.ok(ApiResponse.success(updatedReward, "Reward berhasil diperbarui"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteReward(@PathVariable Long id) {
        try {
            rewardService.deleteReward(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Reward berhasil dihapus"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/claim")
    public ResponseEntity<ApiResponse<RewardClaim>> claimReward(@RequestBody RewardClaimRequest request) {
        try {
            RewardClaim claim = rewardService.processClaim(request);
            return ResponseEntity.ok(ApiResponse.success(claim, "Reward berhasil diklaim"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
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
        try {
            RewardClaim claim = rewardService.confirmClaim(id);
            return ResponseEntity.ok(ApiResponse.success(claim, "Klaim reward berhasil dikonfirmasi"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
