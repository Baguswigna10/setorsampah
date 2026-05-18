package com.example.setorsampah.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.setorsampah.dto.DashboardResponse;
import com.example.setorsampah.model.User;
import com.example.setorsampah.model.WasteTransaction;
import com.example.setorsampah.repository.UserRepository;
import com.example.setorsampah.repository.WasteTransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final WasteTransactionRepository transactionRepository;

    @Override
    public DashboardResponse getSummary() {
        long totalUsers = userRepository.count();
        long totalTransactions = transactionRepository.count();
        double totalTrashKg = transactionRepository.findAll().stream()
                .mapToDouble(WasteTransaction::getTotalWeight)
                .sum();
        double totalPoints = userRepository.findAll().stream()
                .mapToDouble(User::getPoint)
                .sum();
        return new DashboardResponse(totalUsers, totalTransactions, totalTrashKg, totalPoints);
    }
}
