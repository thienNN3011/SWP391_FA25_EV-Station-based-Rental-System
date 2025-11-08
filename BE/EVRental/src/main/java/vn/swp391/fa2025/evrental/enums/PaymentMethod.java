package vn.swp391.fa2025.evrental.enums;

import java.util.Arrays;

public enum PaymentMethod {
    VN_PAY,
    VIETCOMBANK;

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

    public static boolean isValidPaymentMethod(String paymentMethod) {
        try {
            PaymentMethod.valueOf(paymentMethod.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    public static PaymentMethod fromString(String paymentMethod) {
        return Arrays.stream(PaymentMethod.values())
                .filter(p -> p.name().equalsIgnoreCase(paymentMethod))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid payment method: " + paymentMethod));
    }
}