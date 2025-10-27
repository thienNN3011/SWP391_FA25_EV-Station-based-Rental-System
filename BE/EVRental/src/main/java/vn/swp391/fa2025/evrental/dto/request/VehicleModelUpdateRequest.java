package vn.swp391.fa2025.evrental.dto.request;

<<<<<<< HEAD
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;
=======
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VehicleModelUpdateRequest {

    private String name;

    private String brand;

<<<<<<< HEAD
    @Positive(message = "Dung lượng pin phải lớn hơn 0")
    private Long batteryCapacity;

    @Positive(message = "Quãng đường di chuyển phải lớn hơn 0")
    private Long range;

    @Min(value = 1, message = "Số ghế phải ít nhất là 1")
=======
    private Long batteryCapacity;

    private Long range;

>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
    private Integer seat;

    private String description;

<<<<<<< HEAD

    private List<MultipartFile> images;


    private List<String> colors;
=======
    private List<ImageUrlRequest> imageUrls;
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
}