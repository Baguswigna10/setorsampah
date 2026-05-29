package com.example.setorsampah.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.setorsampah.dto.ApiResponse;
import com.example.setorsampah.dto.DashboardResponse;
import com.example.setorsampah.dto.ChartDataResponse;
import com.example.setorsampah.service.DashboardService;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardResponse>> getSummary() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getSummary(), "Ringkasan dashboard berhasil diambil"));
    }

    @GetMapping("/chart")
    public ResponseEntity<ApiResponse<List<ChartDataResponse>>> getChart(
            @RequestParam(defaultValue = "daily") String filter) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getChartData(filter), "Data grafik berhasil diambil"));
    }
}
