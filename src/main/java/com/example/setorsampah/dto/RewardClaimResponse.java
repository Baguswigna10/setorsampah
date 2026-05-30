package com.example.setorsampah.dto;

import java.time.LocalDateTime;

import com.example.setorsampah.model.ClaimStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RewardClaimResponse {
    private Long id;
    private Long userId;
    private String userName;
    private Long rewardId;
    private String rewardName;
    private Double pointCost;
    private LocalDateTime claimDate;
    private ClaimStatus status;
}
