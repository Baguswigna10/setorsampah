package com.example.setorsampah.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.setorsampah.dto.RewardRequest;
import com.example.setorsampah.dto.RewardResponse;
import com.example.setorsampah.mapper.RewardMapper;
import com.example.setorsampah.model.Reward;
import com.example.setorsampah.repository.RewardRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RewardServiceImpl implements RewardService {

    private final RewardRepository rewardRepository;

    @Override
    public List<RewardResponse> getAllRewards() {
        return rewardRepository.findAll().stream().map(RewardMapper::toResponse).toList();
    }

    @Override
    public RewardResponse getRewardById(Long id) {
        return rewardRepository.findById(id)
                .map(RewardMapper::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reward tidak ditemukan"));
    }

    @Override
    @Transactional
    public RewardResponse createReward(RewardRequest request) {
        Reward reward = RewardMapper.toEntity(request);
        return RewardMapper.toResponse(rewardRepository.save(reward));
    }

    @Override
    @Transactional
    public RewardResponse updateReward(Long id, RewardRequest request) {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reward tidak ditemukan"));
        reward.setName(request.getName());
        reward.setPointCost(request.getPointCost());
        reward.setStock(request.getStock());
        return RewardMapper.toResponse(rewardRepository.save(reward));
    }

    @Override
    @Transactional
    public void deleteReward(Long id) {
        if (!rewardRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Reward tidak ditemukan");
        }
        rewardRepository.deleteById(id);
    }
}
