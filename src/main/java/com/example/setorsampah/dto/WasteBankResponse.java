package com.example.setorsampah.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WasteBankResponse {
    private Long id;
    private String name;
    private String address;
    private List<BankCapacityResponse> capacities;
}
