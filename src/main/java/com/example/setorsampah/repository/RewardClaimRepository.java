package com.example.setorsampah.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.setorsampah.model.RewardClaim;
import com.example.setorsampah.model.User;

@Repository
public interface RewardClaimRepository extends JpaRepository<RewardClaim, Long> {
    List<RewardClaim> findByUserOrderByClaimDateDesc(User user);
}
