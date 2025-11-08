package vn.swp391.fa2025.evrental.enums;

import java.util.Arrays;

public enum UserRole {
    RENTER,
    STAFF,
    ADMIN;

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

    public static boolean isValidRole(String role) {
        try {
            UserRole.valueOf(role.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    public static UserRole fromString(String role) {
        return Arrays.stream(UserRole.values())
                .filter(r -> r.name().equalsIgnoreCase(role))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid role: " + role));
    }
}