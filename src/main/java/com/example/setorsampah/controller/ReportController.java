package com.example.setorsampah.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.setorsampah.dto.ApiResponse;
import com.example.setorsampah.dto.TotalWasteReportDto;
import com.example.setorsampah.service.ReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    /**
     * Endpoint untuk mendapatkan laporan total sampah
     * GET /api/reports/total-waste
     * 
     * @return ApiResponse berisi laporan total sampah dengan breakdown per kategori
     */
    @GetMapping("/total-waste")
    public ResponseEntity<ApiResponse<TotalWasteReportDto>> getTotalWasteReport() {
        TotalWasteReportDto report = reportService.getTotalWasteReport();
        return ResponseEntity.ok(
            ApiResponse.success(report, "Laporan total sampah berhasil diambil")
        );
    }
}
