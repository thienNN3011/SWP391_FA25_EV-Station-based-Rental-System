package vn.swp391.fa2025.evrental.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for admin booking detail view - contains full customer information
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminBookingDetailResponse {
    private Long bookingId;
    private AdminCustomerResponse customer;
    private AdminVehicleResponse vehicle;
    private AdminStationResponse station;
    private AdminTariffResponse tariff;

    // Time information
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime actualStartTime;
    private LocalDateTime actualEndTime;
    private LocalDateTime createdDate;

    // Vehicle status
    private String beforeRentingStatus;
    private String afterRentingStatus;
    private Long startOdo;
    private Long endOdo;

    // Payment information
    private BigDecimal expectedTotalAmount;
    private BigDecimal penaltyAmount;
    private BigDecimal totalAmount;

    // Booking status
    private String status;

    // Bank info for refund
    private String bankName;
    private String bankAccount;

    // Payment history
    private List<PaymentHistoryItem> paymentHistory;

    /**
     * Full customer information for admin view
     */
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class AdminCustomerResponse {
        private Long userId;
        private String username;
        private String fullName;
        private String email;
        private String phone;
        private String idCard;
        private String driveLicense;
        private String idCardPhoto;
        private String driveLicensePhoto;
        private String status;
        private LocalDateTime createdDate;
    }

    /**
     * Vehicle information for admin view
     */
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class AdminVehicleResponse {
        private Long vehicleId;
        private Long modelId;
        private String modelName;
        private String brand;
        private String plateNumber;
        private String color;
        private String status;
    }

    /**
     * Station information for admin view
     */
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class AdminStationResponse {
        private Long stationId;
        private String stationName;
        private String address;
        private String openingHours;
        private String status;
    }

    /**
     * Tariff information for admin view
     */
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class AdminTariffResponse {
        private Long tariffId;
        private String type;
        private BigDecimal price;
        private BigDecimal depositAmount;
    }

    /**
     * Payment history item
     */
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class PaymentHistoryItem {
        private Long paymentId;
        private String paymentType;
        private BigDecimal amount;
        private String method;
        private String referenceCode;
        private LocalDateTime transactionDate;
    }
}

