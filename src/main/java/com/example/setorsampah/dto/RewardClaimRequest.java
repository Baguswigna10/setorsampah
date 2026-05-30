package com.example.setorsampah.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RewardClaimRequest {

    @NotNull(message = "User ID tidak boleh kosong")
    private Long userId;

    @NotNull(message = "Reward ID tidak boleh kosong")
    private Long rewardId;
}
