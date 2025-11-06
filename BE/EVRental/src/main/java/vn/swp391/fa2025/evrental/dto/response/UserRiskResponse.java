package vn.swp391.fa2025.evrental.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRiskResponse {
    private Long userId;
    private String username;
    private String fullName;
    private Long totalIncidents;
    private LocalDateTime lastIncidentDate;
}