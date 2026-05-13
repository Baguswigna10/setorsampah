package com.example.setorsampah.service;

import java.util.List;

import com.example.setorsampah.dto.BankCapacityRequest;
import com.example.setorsampah.dto.BankCapacityResponse;
import com.example.setorsampah.dto.WasteBankRequest;
import com.example.setorsampah.dto.WasteBankResponse;

public interface WasteBankService {
    List<WasteBankResponse> getBanks();
    WasteBankResponse getBankById(Long id);
    WasteBankResponse createBank(WasteBankRequest request);
    WasteBankResponse updateBank(Long id, WasteBankRequest request);
    void deleteBank(Long id);
    BankCapacityResponse addCapacity(Long bankId, BankCapacityRequest request);
    List<BankCapacityResponse> getCapacities(Long bankId);
    BankCapacityResponse updateCapacity(Long capacityId, Double maxCapacity);
}
