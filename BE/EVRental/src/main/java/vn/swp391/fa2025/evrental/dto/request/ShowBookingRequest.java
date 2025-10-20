package vn.swp391.fa2025.evrental.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class ShowBookingRequest {
    private Long bookingId;
    private String status;
}
