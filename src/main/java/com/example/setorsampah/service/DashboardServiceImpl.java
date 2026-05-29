package com.example.setorsampah.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.setorsampah.dto.DashboardResponse;
import com.example.setorsampah.dto.ChartDataResponse;
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

    @Override
    public List<ChartDataResponse> getChartData(String filter) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDate;
        
        switch (filter.toLowerCase()) {
            case "weekly":
                startDate = now.minusWeeks(4);
                break;
            case "monthly":
                startDate = now.minusMonths(11).withDayOfMonth(1).withHour(0).withMinute(0);
                break;
            case "yearly":
                startDate = now.minusYears(4).withDayOfYear(1).withHour(0).withMinute(0);
                break;
            case "daily":
            default:
                startDate = now.minusDays(6).withHour(0).withMinute(0);
                break;
        }

        List<WasteTransaction> transactions = transactionRepository.findByTransactionDateBetween(startDate, now);

        Map<String, ChartDataResponse> groupedData = new LinkedHashMap<>();
        
        // Initialize map with empty labels to ensure ordering and zero-filling
        switch (filter.toLowerCase()) {
            case "weekly":
                for (int i = 3; i >= 0; i--) {
                    LocalDateTime weekStart = now.minusWeeks(i);
                    String label = "Minggu " + weekStart.get(java.time.temporal.WeekFields.ISO.weekOfWeekBasedYear());
                    groupedData.put(label, new ChartDataResponse(label, 0.0, 0.0));
                }
                break;
            case "monthly":
                for (int i = 11; i >= 0; i--) {
                    LocalDateTime month = now.minusMonths(i);
                    String label = month.format(DateTimeFormatter.ofPattern("MMM yyyy"));
                    groupedData.put(label, new ChartDataResponse(label, 0.0, 0.0));
                }
                break;
            case "yearly":
                for (int i = 4; i >= 0; i--) {
                    String label = String.valueOf(now.minusYears(i).getYear());
                    groupedData.put(label, new ChartDataResponse(label, 0.0, 0.0));
                }
                break;
            case "daily":
            default:
                for (int i = 6; i >= 0; i--) {
                    LocalDateTime day = now.minusDays(i);
                    String label = day.format(DateTimeFormatter.ofPattern("dd MMM"));
                    groupedData.put(label, new ChartDataResponse(label, 0.0, 0.0));
                }
                break;
        }

        // Aggregate data
        for (WasteTransaction t : transactions) {
            String label;
            switch (filter.toLowerCase()) {
                case "weekly":
                    label = "Minggu " + t.getTransactionDate().get(java.time.temporal.WeekFields.ISO.weekOfWeekBasedYear());
                    break;
                case "monthly":
                    label = t.getTransactionDate().format(DateTimeFormatter.ofPattern("MMM yyyy"));
                    break;
                case "yearly":
                    label = String.valueOf(t.getTransactionDate().getYear());
                    break;
                case "daily":
                default:
                    label = t.getTransactionDate().format(DateTimeFormatter.ofPattern("dd MMM"));
                    break;
            }

            if (groupedData.containsKey(label)) {
                ChartDataResponse data = groupedData.get(label);
                data.setWeight(data.getWeight() + t.getTotalWeight());
                data.setPoints(data.getPoints() + t.getTotalPoint());
            }
        }

        return new ArrayList<>(groupedData.values());
    }
}
