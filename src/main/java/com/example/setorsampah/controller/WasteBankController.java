package com.example.setorsampah.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.setorsampah.model.BankCapacity;
import com.example.setorsampah.model.WasteBank;
import com.example.setorsampah.service.WasteBankService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/waste-banks")
@RequiredArgsConstructor
public class WasteBankController {

    private final WasteBankService bankService;

    @PostMapping
    public ResponseEntity<WasteBank> createBank(@RequestBody WasteBank bank) {
        return new ResponseEntity<>(bankService.createBank(bank), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<WasteBank>> getAllBanks() {
        return ResponseEntity.ok(bankService.getAllBanks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WasteBank> getBankById(@PathVariable Long id) {
        return bankService.getBankById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<WasteBank> updateBank(@PathVariable Long id, @RequestBody WasteBank bankDetails) {
        return ResponseEntity.ok(bankService.updateBank(id, bankDetails));
    }

    @PostMapping("/{id}/capacities")
    public ResponseEntity<BankCapacity> addCapacity(@PathVariable Long id,
            @RequestParam Long categoryId,
            @RequestParam Double maxCapacity) {
        return new ResponseEntity<>(bankService.addCapacity(id, categoryId, maxCapacity), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/capacities")
    public ResponseEntity<List<BankCapacity>> getCapacities(@PathVariable Long id) {
        return ResponseEntity.ok(bankService.getCapacitiesForBank(id));
    }

    @PutMapping("/capacities/{capacityId}")
    public ResponseEntity<BankCapacity> updateCapacity(@PathVariable Long capacityId,
            @RequestParam Double maxCapacity) {
        return ResponseEntity.ok(bankService.updateCapacity(capacityId, maxCapacity));
    }
}
