package com.example.setorsampah.mapper;

import com.example.setorsampah.dto.RewardClaimResponse;
import com.example.setorsampah.dto.RewardRequest;
import com.example.setorsampah.dto.RewardResponse;
import com.example.setorsampah.model.Reward;
import com.example.setorsampah.model.RewardClaim;

public class RewardMapper {

    private RewardMapper() {
    }

    public static RewardResponse toResponse(Reward reward) {
        if (reward == null) {
            return null;
        }
        return new RewardResponse(reward.getId(), reward.getName(), reward.getPointCost(), reward.getStock(), reward.getDescription(), reward.getImageUrl());
    }

    public static Reward toEntity(RewardRequest request) {
        if (request == null) {
            return null;
        }
        Reward reward = new Reward();
        reward.setName(request.getName());
        reward.setPointCost(request.getPointCost());
        reward.setStock(request.getStock());
        reward.setDescription(request.getDescription());
        reward.setImageUrl(request.getImageUrl());
        return reward;
    }

    public static RewardClaimResponse toClaimResponse(RewardClaim claim) {
        if (claim == null) {
            return null;
        }
        return new RewardClaimResponse(
                claim.getId(),
                claim.getUser().getId(),
                claim.getUser().getNama(),
                claim.getReward().getId(),
                claim.getReward().getName(),
                claim.getReward().getPointCost(),
                claim.getClaimDate(),
                claim.getStatus());
    }
}
