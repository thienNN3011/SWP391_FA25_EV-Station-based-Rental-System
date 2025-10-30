package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IncidentReportCreateRequest {

    @NotNull(message = "bookingId không được để trống")
    private Long bookingId;

    @NotBlank(message = "Description không được để trống")
    private String description;

    @NotBlank(message = "Hình ảnh sự cố không được để trống")
    private String incidentImageUrl;
}