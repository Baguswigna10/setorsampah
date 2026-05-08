package com.example.setorsampah.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.setorsampah.model.BankCapacity;
import com.example.setorsampah.model.WasteBank;
import com.example.setorsampah.model.WasteCategory;
import com.example.setorsampah.repository.BankCapacityRepository;
import com.example.setorsampah.repository.WasteBankRepository;
import com.example.setorsampah.repository.WasteCategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WasteBankService {

    private final WasteBankRepository bankRepository;
    private final WasteCategoryRepository categoryRepository;
    private final BankCapacityRepository capacityRepository;

    public WasteBank createBank(WasteBank bank) {
        if (bankRepository.existsByName(bank.getName())) {
            throw new RuntimeException("Bank sampah sudah tersedia");
        }
        return bankRepository.save(bank);
    }

    public List<WasteBank> getAllBanks() {
        return bankRepository.findAll();
    }

    public Optional<WasteBank> getBankById(Long id) {
        return bankRepository.findById(id);
    }

    public WasteBank updateBank(Long id, WasteBank bankDetails) {
        return bankRepository.findById(id).map(bank -> {
            bank.setName(bankDetails.getName());
            bank.setAddress(bankDetails.getAddress());
            return bankRepository.save(bank);
        }).orElseThrow(() -> new RuntimeException("Bank sampah tidak ditemukan"));
    }

    public void deleteBank(Long id) {
        bankRepository.deleteById(id);
    }

    public BankCapacity addCapacity(Long bankId, Long categoryId, Double maxCapacity) {
        WasteBank bank = bankRepository.findById(bankId)
                .orElseThrow(() -> new RuntimeException("Bank sampah tidak ditemukan"));
        WasteCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Kategori sampah tidak ditemukan"));

        if (capacityRepository.findByBankAndCategory(bank, category).isPresent()) {
            throw new RuntimeException("Kapasitas untuk kategori ini sudah ada pada bank sampah");
        }

        BankCapacity capacity = new BankCapacity();
        capacity.setBank(bank);
        capacity.setCategory(category);
        capacity.setMaxCapacity(maxCapacity);
        capacity.setUsedCapacity(0.0);
        return capacityRepository.save(capacity);
    }

    public List<BankCapacity> getCapacitiesForBank(Long bankId) {
        WasteBank bank = bankRepository.findById(bankId)
                .orElseThrow(() -> new RuntimeException("Bank sampah tidak ditemukan"));
        return capacityRepository.findByBank(bank);
    }

    public BankCapacity updateCapacity(Long id, Double maxCapacity) {
        return capacityRepository.findById(id).map(capacity -> {
            capacity.setMaxCapacity(maxCapacity);
            return capacityRepository.save(capacity);
        }).orElseThrow(() -> new RuntimeException("Kapasitas bank sampah tidak ditemukan"));
    }
}
