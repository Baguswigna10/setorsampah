package com.example.setorsampah.service;

import java.util.List;

import com.example.setorsampah.dto.RewardRequest;
import com.example.setorsampah.dto.RewardResponse;

public interface RewardService {
    List<RewardResponse> getAllRewards();
    RewardResponse getRewardById(Long id);
    RewardResponse createReward(RewardRequest request);
    RewardResponse updateReward(Long id, RewardRequest request);
    void deleteReward(Long id);
}
