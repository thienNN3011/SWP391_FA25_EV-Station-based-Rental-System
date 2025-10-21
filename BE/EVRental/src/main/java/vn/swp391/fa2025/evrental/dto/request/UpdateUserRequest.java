package vn.swp391.fa2025.evrental.dto.request;


import jakarta.validation.constraints.NotNull;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserRequest {

    private String password;

    private String phone;

    private String email;
}
