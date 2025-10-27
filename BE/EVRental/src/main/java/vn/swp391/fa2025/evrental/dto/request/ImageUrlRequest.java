package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ImageUrlRequest {

 @NotBlank(message = "Hình ảnh không được để trống")
    private String imageUrl;
    @NotBlank(message = "Màu không được để trống")
    private String color;
}