package com.example.setorsampah.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.example.setorsampah.dto.BankCapacityResponse;
import com.example.setorsampah.dto.WasteBankRequest;
import com.example.setorsampah.dto.WasteBankResponse;
import com.example.setorsampah.model.BankCapacity;
import com.example.setorsampah.model.WasteBank;

public class WasteBankMapper {

    public static WasteBankResponse toResponse(WasteBank bank) {
        if (bank == null) {
            return null;
        }
        List<BankCapacityResponse> capacities = bank.getCapacities().stream()
                .map(WasteBankMapper::toCapacityResponse)
                .collect(Collectors.toList());
        return new WasteBankResponse(bank.getId(), bank.getName(), bank.getAddress(), capacities);
    }

    public static BankCapacityResponse toCapacityResponse(BankCapacity capacity) {
        if (capacity == null) {
            return null;
        }
        return new BankCapacityResponse(
                capacity.getId(),
                capacity.getBank().getId(),
                capacity.getCategory().getId(),
                capacity.getCategory().getName(),
                capacity.getMaxCapacity(),
                capacity.getUsedCapacity(),
                capacity.getAvailableCapacity());
    }

    public static WasteBank toEntity(WasteBankRequest request) {
        if (request == null) {
            return null;
        }
        WasteBank bank = new WasteBank();
        bank.setName(request.getName());
        bank.setAddress(request.getAddress());
        return bank;
    }
}
