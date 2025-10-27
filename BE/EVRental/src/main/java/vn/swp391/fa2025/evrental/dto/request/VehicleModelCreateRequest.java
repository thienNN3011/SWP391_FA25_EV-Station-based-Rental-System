package vn.swp391.fa2025.evrental.dto.request;

<<<<<<< HEAD
import jakarta.validation.constraints.*;
=======
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VehicleModelCreateRequest {

<<<<<<< HEAD
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
    private List<@NotNull(message = "Tệp hình ảnh không được null") MultipartFile> images;

    @NotEmpty(message = "Danh sách màu không được để trống")
    @Size(min = 1, message = "Phải có ít nhất một màu")
    private List<@NotBlank(message = "Màu không được để trống") String> colors;
=======
    private String name;

    private String brand;

    private Long batteryCapacity;

    private Long range;

    private Integer seat;

    private String description;

    private List<MultipartFile> images;
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
}