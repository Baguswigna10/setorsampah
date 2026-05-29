package com.example.setorsampah.service;

import com.example.setorsampah.dto.DashboardResponse;
import com.example.setorsampah.dto.ChartDataResponse;
import java.util.List;

public interface DashboardService {
    DashboardResponse getSummary();
    List<ChartDataResponse> getChartData(String filter);
}
