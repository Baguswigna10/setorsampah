package com.example.setorsampah.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.setorsampah.model.WasteBank;

@Repository
public interface WasteBankRepository extends JpaRepository<WasteBank, Long> {
    boolean existsByName(String name);
}
