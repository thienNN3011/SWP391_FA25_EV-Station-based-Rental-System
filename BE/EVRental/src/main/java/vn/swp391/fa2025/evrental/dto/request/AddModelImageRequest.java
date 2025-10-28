package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddModelImageRequest {

    @NotNull(message = "File ảnh không được để trống")
    private MultipartFile image;

    @NotBlank(message = "Màu không được để trống")
    private String color;
}
