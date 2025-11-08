package vn.swp391.fa2025.evrental.enums;

import java.util.Arrays;

public enum PaymentType {
    DEPOSIT,
    REFUND_DEPOSIT,
    FINAL_PAYMENT;

    @Override
    public String toString() {
        return this.name();
    }

    public String getValue() {
        return this.name();
    }

    public String getDisplayName() {
        return this.name();
    }

    public static boolean isValidPaymentType(String paymentType) {
        try {
            PaymentType.valueOf(paymentType.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    public static PaymentType fromString(String paymentType) {
        return Arrays.stream(PaymentType.values())
                .filter(p -> p.name().equalsIgnoreCase(paymentType))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid payment type: " + paymentType));
    }
}