package com.example.setorsampah.dto;

import lombok.Data;

@Data
public class RewardClaimRequest {
    private Long userId; // For simulation. In real app, get from JWT token.
    private Long rewardId;
}
