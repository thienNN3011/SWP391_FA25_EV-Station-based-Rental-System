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
public class IncidentReportUpdateRequest {

    @NotNull(message = "Report ID không được để trống")
    private Long reportId;

    @NotBlank(message = "Status không được để trống")
    private String status;

}