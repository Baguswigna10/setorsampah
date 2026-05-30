package com.example.setorsampah.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("ADMIN")
@NoArgsConstructor
public class Admin extends User {

    @Override
    public double calculateBonusPoint(double basePoint) {
        return 0.0;
    }

    @Override
    public boolean canProcessTransaction() {
        return false;
    }

    @Override
    public String getRole() {
        return "ADMIN";
    }
}
