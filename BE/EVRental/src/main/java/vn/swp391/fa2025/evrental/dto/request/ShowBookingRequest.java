package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowBookingRequest {
    private Long bookingId;
    private String status;

    // Pagination parameters
    @Min(value = 0, message = "Page number must be >= 0")
    private Integer page = 0;

    @Min(value = 1, message = "Page size must be >= 1")
    private Integer size = 20;

    // Search parameter
    private String searchQuery;
}
