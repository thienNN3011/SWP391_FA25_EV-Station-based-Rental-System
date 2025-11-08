package vn.swp391.fa2025.evrental.enums;

import java.util.Arrays;

public enum ContractStatus {
    PENDING,
    CONFIRMED,
    CANCELLED;

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

    public static boolean isValidStatus(String status) {
        try {
            ContractStatus.valueOf(status.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    public static ContractStatus fromString(String status) {
        return Arrays.stream(ContractStatus.values())
                .filter(s -> s.name().equalsIgnoreCase(status))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid status: " + status));
    }
}