package com.example.setorsampah.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.setorsampah.model.BankCapacity;
import com.example.setorsampah.model.WasteBank;
import com.example.setorsampah.model.WasteCategory;

@Repository
public interface BankCapacityRepository extends JpaRepository<BankCapacity, Long> {
    Optional<BankCapacity> findByBankAndCategory(WasteBank bank, WasteCategory category);
    List<BankCapacity> findByBank(WasteBank bank);
}
