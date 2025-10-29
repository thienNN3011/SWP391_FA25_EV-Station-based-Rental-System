package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IncidentReportCreateRequest
{
    @NotNull
    private Long bookingId;
}
