package com.example.setorsampah.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.setorsampah.dto.RewardClaimRequest;
import com.example.setorsampah.dto.RewardClaimResponse;
import com.example.setorsampah.mapper.RewardMapper;
import com.example.setorsampah.model.ClaimStatus;
import com.example.setorsampah.model.Reward;
import com.example.setorsampah.model.RewardClaim;
import com.example.setorsampah.model.User;
import com.example.setorsampah.model.Warga;
import com.example.setorsampah.repository.RewardClaimRepository;
import com.example.setorsampah.repository.RewardRepository;
import com.example.setorsampah.repository.UserRepository;
import com.example.setorsampah.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RewardClaimServiceImpl implements RewardClaimService {

    private final RewardClaimRepository claimRepository;
    private final RewardRepository rewardRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;

    @Override
    @Transactional
    public RewardClaimResponse claimReward(RewardClaimRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User tidak ditemukan"));

        if (!(user instanceof Warga)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hanya warga yang dapat menukar reward");
        }

        Long currentUserId = securityUtils.getCurrentUserId();
        if (currentUserId != null && !currentUserId.equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tidak dapat menukar reward untuk user lain");
        }

        Reward reward = rewardRepository.findById(request.getRewardId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reward tidak ditemukan"));

        if (reward.getStock() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stok reward habis");
        }

        if (user.getPoint() < reward.getPointCost()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Poin tidak mencukupi");
        }

        user.setPoint(user.getPoint() - reward.getPointCost());
        reward.setStock(reward.getStock() - 1);
        userRepository.save(user);
        rewardRepository.save(reward);

        RewardClaim claim = new RewardClaim();
        claim.setUser(user);
        claim.setReward(reward);
        claim.setClaimDate(LocalDateTime.now());
        claim.setStatus(ClaimStatus.APPROVED);

        return RewardMapper.toClaimResponse(claimRepository.save(claim));
    }

    @Override
    public List<RewardClaimResponse> getClaimsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User tidak ditemukan"));

        Long currentUserId = securityUtils.getCurrentUserId();
        if (currentUserId != null && !securityUtils.isAdmin() && !currentUserId.equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tidak dapat melihat riwayat claim user lain");
        }

        return claimRepository.findByUserIdOrderByClaimDateDesc(userId).stream()
                .map(RewardMapper::toClaimResponse)
                .toList();
    }
}
