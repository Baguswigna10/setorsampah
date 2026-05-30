package com.example.setorsampah.model;

/**
 * Abstraction for point-related business logic that varies by user type.
 */
public interface PointCalculatable {

    /**
     * Calculates bonus points applied on top of base transaction points.
     */
    double calculateBonusPoint(double basePoint);

    /**
     * Validates whether the user may process a waste transaction.
     */
    boolean canProcessTransaction();
}
