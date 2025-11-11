package vn.swp391.fa2025.evrental.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequest {
    @NotBlank(message = "Tên trạm thuê không được để trống")
    private String stationName;
    @NotNull(message = "Vui lòng chọn mẫu xe")
    private Long modelId;
    @NotBlank(message = "Vui lòng chọn màu xe")
    private String color;
    @NotNull(message = "Vui lòng chọn gói giá thuê")
    private Long tariffId;
    @NotNull(message = "Thời gian bắt đầu không được để trống")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;
    @NotNull(message = "Thời gian kết thúc không được để trống")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;
}
