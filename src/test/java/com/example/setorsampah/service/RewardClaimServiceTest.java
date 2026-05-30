package com.example.setorsampah.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import com.example.setorsampah.dto.RewardClaimRequest;
import com.example.setorsampah.dto.RewardClaimResponse;
import com.example.setorsampah.model.ClaimStatus;
import com.example.setorsampah.model.Reward;
import com.example.setorsampah.model.RewardClaim;
import com.example.setorsampah.model.Warga;
import com.example.setorsampah.repository.RewardClaimRepository;
import com.example.setorsampah.repository.RewardRepository;
import com.example.setorsampah.repository.UserRepository;
import com.example.setorsampah.security.SecurityUtils;

@ExtendWith(MockitoExtension.class)
class RewardClaimServiceTest {

    @Mock
    private RewardClaimRepository claimRepository;
    @Mock
    private RewardRepository rewardRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SecurityUtils securityUtils;

    @InjectMocks
    private RewardClaimServiceImpl rewardClaimService;

    @Test
    void claimReward_deductsPointsAndStock() {
        Warga warga = new Warga();
        warga.setId(2L);
        warga.setNama("Budi");
        warga.setPoint(600.0);

        Reward reward = new Reward();
        reward.setId(1L);
        reward.setName("Voucher");
        reward.setPointCost(500.0);
        reward.setStock(5);

        when(userRepository.findById(2L)).thenReturn(Optional.of(warga));
        when(rewardRepository.findById(1L)).thenReturn(Optional.of(reward));
        when(securityUtils.getCurrentUserId()).thenReturn(2L);
        when(claimRepository.save(any(RewardClaim.class))).thenAnswer(invocation -> {
            RewardClaim claim = invocation.getArgument(0);
            claim.setId(10L);
            return claim;
        });

        RewardClaimResponse response = rewardClaimService.claimReward(new RewardClaimRequest(2L, 1L));

        assertEquals(100.0, warga.getPoint());
        assertEquals(4, reward.getStock());
        assertEquals(ClaimStatus.APPROVED, response.getStatus());
        verify(userRepository).save(warga);
        verify(rewardRepository).save(reward);
    }

    @Test
    void claimReward_rejectsInsufficientPoints() {
        Warga warga = new Warga();
        warga.setId(2L);
        warga.setPoint(50.0);

        Reward reward = new Reward();
        reward.setId(1L);
        reward.setPointCost(500.0);
        reward.setStock(5);

        when(userRepository.findById(2L)).thenReturn(Optional.of(warga));
        when(rewardRepository.findById(1L)).thenReturn(Optional.of(reward));
        when(securityUtils.getCurrentUserId()).thenReturn(2L);

        assertThrows(ResponseStatusException.class,
                () -> rewardClaimService.claimReward(new RewardClaimRequest(2L, 1L)));
    }
}
