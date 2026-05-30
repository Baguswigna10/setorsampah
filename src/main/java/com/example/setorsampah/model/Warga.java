package com.example.setorsampah.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("USER")
@NoArgsConstructor
public class Warga extends User {

    private static final double BONUS_RATE = 0.10;

    @Override
    public double calculateBonusPoint(double basePoint) {
        return basePoint * BONUS_RATE;
    }

    @Override
    public boolean canProcessTransaction() {
        return true;
    }

    @Override
    public String getRole() {
        return "WARGA";
    }
}
