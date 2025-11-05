package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleModelDeleteImageRequest {

    @NotNull(message = "ID hình ảnh không được để trống")
    private Long id;
}