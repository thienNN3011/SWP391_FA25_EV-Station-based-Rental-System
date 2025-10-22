package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VehicleCreateRequest {

        @NotNull(message = "Model ID không được để trống")
        private Long modelId;

        @NotNull(message = "Station ID không được để trống")
        private Long stationId;

        @NotBlank(message = "Màu xe không được để trống")
        private String color;

        @NotBlank(message = "Biển số xe không được để trống")
        private String plateNumber;



}