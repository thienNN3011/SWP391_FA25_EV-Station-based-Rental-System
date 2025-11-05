package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VehicleModelCreateRequest {

    @NotBlank(message = "Tên mẫu xe không được để trống")
    private String name;

    @NotBlank(message = "Thương hiệu không được để trống")
    private String brand;

    @NotNull(message = "Dung lượng pin không được để trống")
    @Positive(message = "Dung lượng pin phải lớn hơn 0")
    private Long batteryCapacity;

    @NotNull(message = "Quãng đường di chuyển không được để trống")
    @Positive(message = "Quãng đường di chuyển phải lớn hơn 0")
    private Long range;

    @NotNull(message = "Số ghế không được để trống")
    @Min(value = 1, message = "Số ghế phải ít nhất là 1")
    private Integer seat;

    @NotBlank(message = "Mô tả không được để trống")
    private String description;

    @NotEmpty(message = "Danh sách hình ảnh không được để trống")
    @Size(min = 1, message = "Phải có ít nhất một hình ảnh")
    private List<@Valid ModelImageData> images;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ModelImageData {
        @NotBlank(message = "URL hình ảnh không được để trống")
        private String imageUrl;

        @NotBlank(message = "Màu không được để trống")
        private String color;
    }
}