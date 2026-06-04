package com.example.setorsampah.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RewardResponse {
    private Long id;
    private String name;
    private Double pointCost;
    private Integer stock;
    private String description;
    private String imageUrl;
}
