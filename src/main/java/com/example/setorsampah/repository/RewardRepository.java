package com.example.setorsampah.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.setorsampah.model.Reward;

@Repository
public interface RewardRepository extends JpaRepository<Reward, Long> {
}
