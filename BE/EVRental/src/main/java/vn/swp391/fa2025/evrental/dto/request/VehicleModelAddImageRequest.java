package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VehicleModelAddImageRequest {

    @NotEmpty(message = "Danh sách hình ảnh không được để trống")
    @Size(min = 1, message = "Phải có ít nhất một hình ảnh")
    private List<@Valid ImageData> images;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageData {
        @NotBlank(message = "URL hình ảnh không được để trống")
        private String imageUrl;

        @NotBlank(message = "Màu không được để trống")
        private String color;
    }
}