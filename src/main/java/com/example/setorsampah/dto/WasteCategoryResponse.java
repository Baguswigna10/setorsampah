package com.example.setorsampah.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WasteCategoryResponse {
    private Long id;
    private String name;
    private Double pointPerKg;
    private String description;
}
