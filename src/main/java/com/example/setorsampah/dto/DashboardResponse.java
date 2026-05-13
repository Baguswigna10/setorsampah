package com.example.setorsampah.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private Long totalUsers;
    private Long totalTransactions;
    private Double totalTrashKg;
    private Double totalPoints;
}
