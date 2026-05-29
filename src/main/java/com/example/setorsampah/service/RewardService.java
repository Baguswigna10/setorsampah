package com.example.setorsampah.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.setorsampah.dto.RewardClaimRequest;
import com.example.setorsampah.model.Reward;
import com.example.setorsampah.model.RewardClaim;
import com.example.setorsampah.model.User;
import com.example.setorsampah.repository.RewardClaimRepository;
import com.example.setorsampah.repository.RewardRepository;
import com.example.setorsampah.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final RewardRepository rewardRepository;
    private final RewardClaimRepository rewardClaimRepository;
    private final UserRepository userRepository;

    public List<Reward> getAllRewards() {
        return rewardRepository.findAll();
    }

    @Transactional
    public Reward createReward(Reward reward) {
        return rewardRepository.save(reward);
    }

    @Transactional
    public Reward updateReward(Long id, Reward rewardDetails) {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reward tidak ditemukan dengan id: " + id));
        
        reward.setName(rewardDetails.getName());
        reward.setDescription(rewardDetails.getDescription());
        reward.setRequiredPoints(rewardDetails.getRequiredPoints());
        reward.setStock(rewardDetails.getStock());
        reward.setImageUrl(rewardDetails.getImageUrl());

        return rewardRepository.save(reward);
    }

    @Transactional
    public void deleteReward(Long id) {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reward tidak ditemukan dengan id: " + id));
        rewardRepository.delete(reward);
    }

    @Transactional
    public RewardClaim processClaim(RewardClaimRequest request) {
        // 1. Fetch User
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        // 2. Fetch Reward
        Reward reward = rewardRepository.findById(request.getRewardId())
                .orElseThrow(() -> new RuntimeException("Reward tidak ditemukan"));

        // 3. Validations
        if (reward.getStock() <= 0) {
            throw new RuntimeException("Stok reward habis");
        }

        if (user.getPoint() < reward.getRequiredPoints()) {
            throw new RuntimeException("Point anda kurang");
        }

        // 4. Process Deductions
        user.setPoint(user.getPoint() - reward.getRequiredPoints());
        reward.setStock(reward.getStock() - 1);

        userRepository.save(user);
        rewardRepository.save(reward);

        // 5. Save History
        RewardClaim claim = new RewardClaim();
        claim.setUser(user);
        claim.setReward(reward);
        claim.setPointsSpent(reward.getRequiredPoints());
        claim.setStatus("PENDING");
        claim.setClaimDate(LocalDateTime.now());

        return rewardClaimRepository.save(claim);
    }

    public List<RewardClaim> getAllClaims() {
        return rewardClaimRepository.findAllByOrderByClaimDateDesc();
    }

    public List<RewardClaim> getClaimsByUserId(Long userId) {
        return rewardClaimRepository.findByUserIdOrderByClaimDateDesc(userId);
    }

    @Transactional
    public RewardClaim confirmClaim(Long claimId) {
        RewardClaim claim = rewardClaimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Klaim reward tidak ditemukan"));
        if (!"PENDING".equalsIgnoreCase(claim.getStatus())) {
            throw new RuntimeException("Klaim ini sudah dikonfirmasi atau dibatalkan");
        }
        claim.setStatus("SUCCESS");
        return rewardClaimRepository.save(claim);
    }
}
