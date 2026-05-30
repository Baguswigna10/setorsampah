package com.example.setorsampah.service;

import java.util.List;

import com.example.setorsampah.dto.RewardClaimRequest;
import com.example.setorsampah.dto.RewardClaimResponse;

public interface RewardClaimService {
    RewardClaimResponse claimReward(RewardClaimRequest request);
    List<RewardClaimResponse> getClaimsByUserId(Long userId);
}
