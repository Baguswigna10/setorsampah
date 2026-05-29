package com.example.setorsampah.config;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.JdbcTemplate;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DatabaseCleanup {
    
    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void cleanup() {
        try {
            jdbcTemplate.execute("DELETE t1 FROM bank_capacities t1 INNER JOIN bank_capacities t2 WHERE t1.id > t2.id AND t1.bank_id = t2.bank_id AND t1.category_id = t2.category_id;");
            System.out.println("BERHASIL: Data duplikat di tabel bank_capacities telah dibersihkan.");
        } catch (Exception e) {
            System.err.println("Gagal membersihkan data duplikat: " + e.getMessage());
        }
    }
}
