package com.example.setorsampah.service;

import com.example.setorsampah.dto.TotalWasteReportDto;

public interface ReportService {
    /**
     * Mendapatkan laporan total sampah dengan breakdown per kategori
     * @return TotalWasteReportDto berisi total transaksi, berat, poin, dan breakdown per kategori
     */
    TotalWasteReportDto getTotalWasteReport();
}
