package vn.swp391.fa2025.evrental.dto.request;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRequest {

    private String password;

    private String phone;

    private String email;
}
