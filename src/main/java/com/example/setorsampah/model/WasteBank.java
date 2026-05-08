package com.example.setorsampah.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "waste_banks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WasteBank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String address;

    @OneToMany(mappedBy = "bank")
    @JsonIgnore
    @ToString.Exclude
    private List<BankCapacity> capacities = new ArrayList<>();

    @OneToMany(mappedBy = "bank")
    @JsonIgnore
    @ToString.Exclude
    private List<WasteTransaction> transactions = new ArrayList<>();
}
