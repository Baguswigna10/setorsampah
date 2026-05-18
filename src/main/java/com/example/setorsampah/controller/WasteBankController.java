package com.example.setorsampah.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.setorsampah.dto.ApiResponse;
import com.example.setorsampah.dto.BankCapacityRequest;
import com.example.setorsampah.dto.BankCapacityResponse;
import com.example.setorsampah.dto.WasteBankRequest;
import com.example.setorsampah.dto.WasteBankResponse;
import com.example.setorsampah.service.WasteBankService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/waste-banks")
@RequiredArgsConstructor
@Validated
public class WasteBankController {

    private final WasteBankService bankService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WasteBankResponse>>> getBanks() {
        return ResponseEntity.ok(ApiResponse.success(bankService.getBanks(), "Daftar bank sampah berhasil diambil"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WasteBankResponse>> getBankById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(bankService.getBankById(id), "Bank sampah ditemukan"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WasteBankResponse>> createBank(@Valid @RequestBody WasteBankRequest request) {
        return new ResponseEntity<>(ApiResponse.success(bankService.createBank(request), "Bank sampah berhasil dibuat"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WasteBankResponse>> updateBank(@PathVariable Long id, @Valid @RequestBody WasteBankRequest request) {
        return ResponseEntity.ok(ApiResponse.success(bankService.updateBank(id, request), "Bank sampah berhasil diperbarui"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBank(@PathVariable Long id) {
        bankService.deleteBank(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Bank sampah berhasil dihapus"));
    }

    @PostMapping("/{id}/capacities")
    public ResponseEntity<ApiResponse<BankCapacityResponse>> addCapacity(@PathVariable Long id, @Valid @RequestBody BankCapacityRequest request) {
        return new ResponseEntity<>(ApiResponse.success(bankService.addCapacity(id, request), "Kapasitas bank sampah berhasil ditambahkan"), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/capacities")
    public ResponseEntity<ApiResponse<List<BankCapacityResponse>>> getCapacities(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(bankService.getCapacities(id), "Daftar kapasitas bank sampah berhasil diambil"));
    }

    @PutMapping("/capacities/{capacityId}")
    public ResponseEntity<ApiResponse<BankCapacityResponse>> updateCapacity(@PathVariable Long capacityId, @RequestBody BankCapacityRequest request) {
        return ResponseEntity.ok(ApiResponse.success(bankService.updateCapacity(capacityId, request.getMaxCapacity()), "Kapasitas bank sampah berhasil diperbarui"));
    }
}
