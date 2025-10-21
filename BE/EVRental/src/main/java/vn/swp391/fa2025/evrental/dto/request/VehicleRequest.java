package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class VehicleRequest {

    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    public static class VehicleCreateRequest {
        @NotNull(message = "Model ID không được để trống")
        private Long modelId;

        @NotNull(message = "Station ID không được để trống")
        private Long stationId;

        @NotBlank(message = "Màu xe không được để trống")
        private String color;

        @NotBlank(message = "Biển số xe không được để trống")
        private String plateNumber;

    }

    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    public static class VehicleUpdateRequest {

        private Long modelId;


        private Long stationId;


        private String color;


        private String plateNumber;


        @Pattern(
                regexp = "^(AVAILABLE|BOOKED|IN_USE|MAINTENANCE|INACTIVE)$",
                message = "Trạng thái phải là: AVAILABLE, BOOKED, IN_USE, MAINTENANCE hoặc INACTIVE"
        )
        private String status;

    }
}