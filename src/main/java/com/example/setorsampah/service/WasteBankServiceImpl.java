package com.example.setorsampah.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.setorsampah.dto.BankCapacityRequest;
import com.example.setorsampah.dto.BankCapacityResponse;
import com.example.setorsampah.dto.WasteBankRequest;
import com.example.setorsampah.dto.WasteBankResponse;
import com.example.setorsampah.mapper.WasteBankMapper;
import com.example.setorsampah.model.BankCapacity;
import com.example.setorsampah.model.WasteBank;
import com.example.setorsampah.model.WasteCategory;
import com.example.setorsampah.repository.BankCapacityRepository;
import com.example.setorsampah.repository.WasteBankRepository;
import com.example.setorsampah.repository.WasteCategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WasteBankServiceImpl implements WasteBankService {

    private final WasteBankRepository bankRepository;
    private final WasteCategoryRepository categoryRepository;
    private final BankCapacityRepository capacityRepository;

    @Override
    public List<WasteBankResponse> getBanks() {
        return bankRepository.findAll().stream().map(WasteBankMapper::toResponse).toList();
    }

    @Override
    public WasteBankResponse getBankById(Long id) {
        return bankRepository.findById(id)
                .map(WasteBankMapper::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bank sampah tidak ditemukan"));
    }

    @Override
    public WasteBankResponse createBank(WasteBankRequest request) {
        if (bankRepository.existsByName(request.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bank sampah sudah tersedia");
        }
        WasteBank bank = WasteBankMapper.toEntity(request);
        return WasteBankMapper.toResponse(bankRepository.save(bank));
    }

    @Override
    public WasteBankResponse updateBank(Long id, WasteBankRequest request) {
        return bankRepository.findById(id).map(bank -> {
            bank.setName(request.getName());
            bank.setAddress(request.getAddress());
            return WasteBankMapper.toResponse(bankRepository.save(bank));
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bank sampah tidak ditemukan"));
    }

    @Override
    public void deleteBank(Long id) {
        if (!bankRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bank sampah tidak ditemukan");
        }
        bankRepository.deleteById(id);
    }

    @Override
    public BankCapacityResponse addCapacity(Long bankId, BankCapacityRequest request) {
        WasteBank bank = bankRepository.findById(bankId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bank sampah tidak ditemukan"));
        WasteCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kategori sampah tidak ditemukan"));
        if (capacityRepository.findByBankAndCategory(bank, category).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Kapasitas kategori sudah ada di bank sampah");
        }
        BankCapacity capacity = new BankCapacity();
        capacity.setBank(bank);
        capacity.setCategory(category);
        capacity.setMaxCapacity(request.getMaxCapacity());
        capacity.setUsedCapacity(0.0);
        return WasteBankMapper.toCapacityResponse(capacityRepository.save(capacity));
    }

    @Override
    public List<BankCapacityResponse> getCapacities(Long bankId) {
        WasteBank bank = bankRepository.findById(bankId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bank sampah tidak ditemukan"));
        return capacityRepository.findByBank(bank).stream()
                .map(WasteBankMapper::toCapacityResponse)
                .toList();
    }

    @Override
    @Transactional
    public BankCapacityResponse updateCapacity(Long capacityId, Double maxCapacity) {
        if (maxCapacity == null || maxCapacity <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kapasitas maksimum harus lebih besar dari nol");
        }
        return capacityRepository.findById(capacityId).map(capacity -> {
            capacity.setMaxCapacity(maxCapacity);
            return WasteBankMapper.toCapacityResponse(capacityRepository.save(capacity));
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kapasitas bank sampah tidak ditemukan"));
    }
}
