package vn.swp391.fa2025.evrental.enums;

import java.util.Arrays;

public enum BookingStatus {
    BOOKING,
    UNCONFIRMED,
    CANCELLED,
    RENTING,
    COMPLETED,
    NO_SHOW;

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
            BookingStatus.valueOf(status.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    public static BookingStatus fromString(String status) {
        return Arrays.stream(BookingStatus.values())
                .filter(s -> s.name().equalsIgnoreCase(status))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid status: " + status));
    }
}