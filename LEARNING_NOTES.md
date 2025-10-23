# LEARNING NOTES — Bảo mật mật khẩu với BCrypt (không backfill)

Ngày: 2025-10-16

1) Overview (mục tiêu, bối cảnh)
- Mục tiêu: Ngừng lưu mật khẩu dạng plain-text; dùng BCrypt để mã hoá khi đăng ký và kiểm tra bằng `matches()` khi đăng nhập.
- Bối cảnh: Hiện tại `AuthService` so sánh `password.equals(user.getPassword())` và `RegistrationService` lưu mật khẩu raw → không an toàn. Bạn xác nhận chưa có dữ liệu trong DB, vì vậy không cần backfill.

2) Core concepts (giải thích ngắn gọn)
- BCrypt: thuật toán băm 1 chiều, có salt, chống rainbow table, có tham số chi phí (work factor). Kết quả băm bắt đầu bằng `$2a$`, `$2b$` hoặc `$2y$`.
- PasswordEncoder: interface Spring Security; `BCryptPasswordEncoder` cung cấp `encode(raw)` và `matches(raw, encoded)`.
- Nguyên tắc: Không log mật khẩu/hashes; không bao giờ so sánh plain-text.

3) Preparation (yêu cầu môi trường)
- Đã có `spring-boot-starter-security` trong `BE/EVRental/pom.xml` (không cần thêm lib crypto riêng).
- API base path: `/EVRental` (context-path). Các endpoint auth nằm dưới `/auth/**` đã được `permitAll` trong `SecurityConfig`.
- Không có dữ liệu hiện hữu → không cần backfill/migration.

4) Steps (các bước triển khai)
- Thêm bean `PasswordEncoder` (BCrypt) trong `SecurityConfig`:
  - File: `BE/EVRental/src/main/java/vn/swp391/fa2025/evrental/config/SecurityConfig.java`
  - Thêm import: `org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder`; `org.springframework.security.crypto.password.PasswordEncoder`.
  - Thêm bean:
    ```java
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10); // work factor 10
    }
    ```
- Mã hoá mật khẩu khi đăng ký (RegistrationService):
  - File: `BE/EVRental/src/main/java/vn/swp391/fa2025/evrental/service/RegistrationService.java`
  - Tiêm `PasswordEncoder` vào service (constructor hoặc `@Autowired`).
  - Sau khi map `User user = userMapper.toEntity(...)`, trước khi `save`:
    ```java
    user.setPassword(passwordEncoder.encode(req.getPassword()));
    ```
- Kiểm tra đăng nhập dùng `matches` (AuthService):
  - File: `BE/EVRental/src/main/java/vn/swp391/fa2025/evrental/service/AuthService.java`
  - Tiêm `PasswordEncoder`.
  - Thay so sánh:
    ```java
    if (!passwordEncoder.matches(password, user.getPassword())) {
        throw new RuntimeException("Invalid username or password");
    }
    ```
- Xác nhận DTO không lộ mật khẩu: `CustomerResponse` không có field `password` (đã OK).
- Quét nhanh repo để tránh còn chỗ nào so sánh/muộn phiền với plain-text.

5) Testing (cách kiểm thử nhanh)
- Đăng ký user mới (multipart form-data): `POST /EVRental/users`
  - Trường: `username`, `password`, `fullName`, `email`, `phone`, `idCard`, `driveLicense`, `idCardPhoto` (file), `driveLicensePhoto` (file).
  - Kỳ vọng: DB lưu `users.password` là chuỗi bắt đầu bằng `$2b$` và dài ~60 ký tự.
- Đăng nhập: `POST /EVRental/auth/login` với `username` và mật khẩu raw vừa dùng khi đăng ký.
  - Kỳ vọng: Nhận được `token` JWT. Nếu sai, trả lỗi "Invalid username or password".
- Ví dụ cURL (Windows PowerShell, thay đường dẫn file và giá trị):
  ```powershell
  # Đăng ký
  curl -Method POST "http://localhost:8080/EVRental/users" -ContentType "multipart/form-data" `
    -Form username="alice" `
    -Form password="Secret@123" `
    -Form fullName="Alice" `
    -Form email="alice@example.com" `
    -Form phone="+84123456789" `
    -Form idCard="123456789" `
    -Form driveLicense="DL-0001" `
    -Form idCardPhoto="@C:\\path\\to\\id.jpg" `
    -Form driveLicensePhoto="@C:\\path\\to\\dl.jpg"

  # Đăng nhập
  curl -Method POST "http://localhost:8080/EVRental/auth/login" `
    -H "Content-Type: application/json" `
    -Body '{"username":"alice","password":"Secret@123"}'
  ```

6) Troubleshooting (sự cố thường gặp)
- Login fail sau khi đổi: có thể đăng ký chưa encode (thiếu tiêm `PasswordEncoder`) hoặc vẫn còn so sánh `equals(...)` ở đâu đó.
- `NoSuchBeanDefinitionException`: quên khai báo bean `PasswordEncoder` trong `SecurityConfig`.
- Double-encode: chỉ `encode` ở đường đăng ký/cập nhật; KHÔNG `encode` trong login.
- 401 lên endpoint khác: nhớ gửi `Authorization: Bearer <token>`; `/auth/**` đã `permitAll` nhưng các API còn lại yêu cầu JWT hợp lệ.

7) Customization/Advanced
- Work factor: 10 là cân bằng; có thể tăng 12–14 nếu hạ tầng đủ mạnh.
- Mở rộng policy mật khẩu: thêm ràng buộc `@Size`, regex độ mạnh (ít nhất 8 ký tự, chữ hoa/thường, số, ký tự đặc biệt...).
- Về sau có thể chuyển sang dùng `AuthenticationManager` + `UserDetailsService` chuẩn Spring Security (thay vì tự đối sánh trong `AuthService`).
- Nếu tương lai có dữ liệu cũ: thêm runner backfill (chỉ encode nếu không có prefix `$2a$/$2b$/$2y$`).

8) Next steps (hành động nhỏ, cụ thể)
- [ ] Thêm bean `PasswordEncoder` (BCrypt) vào `SecurityConfig`.
- [ ] Encode mật khẩu trong `RegistrationService` trước khi `save`.
- [ ] Dùng `passwordEncoder.matches(...)` trong `AuthService` khi login.
- [ ] Kiểm thử 2 luồng: đăng ký → đăng nhập; xác nhận JWT và hash trong DB.
- [ ] Cập nhật tài liệu README (mục Security) nhắc rõ: không lưu plain-text.

---

# LEARNING NOTES — API Station của staff + danh sách xe (rút gọn có status)

Ngày: 2025-10-23

1) Overview (mục tiêu, bối cảnh)
- Mục tiêu: Thêm API trả về thông tin trạm gắn với user hiện tại và danh sách xe thuộc trạm đó.
- Bối cảnh: Đã có DTO `StationResponse` (3 cột) và `VehicleResponse`. Cần trả thêm danh sách xe (bao gồm `status`).

2) Core concepts
- Lấy username từ JWT qua `SecurityContextHolder` (đã được `JwtAuthenticationFilter` set `Authentication`).
- Phân quyền tại `SecurityConfig`: `GET /station/me` yêu cầu `STAFF` hoặc `ADMIN`.
- Không trả entity trực tiếp; dùng DTO + mapper MapStruct để kiểm soát dữ liệu.

3) Preparation
- Không đổi stack. Sử dụng sẵn `VehicleRepository`, `VehicleMapper`, `UserRepository`.
- Context-path: `/EVRental` → endpoint là `/EVRental/station/me`.

4) Steps (đã triển khai)
- Thêm DTO gộp: `MyStationResponse { stationName, address, openingHours, List<VehicleResponse> vehicles }`.
- Repository: bổ sung `List<Vehicle> findByStation_StationId(Long stationId)`.
- Mapper: mở rộng `VehicleMapper.toShortVehicleResponse` để map thêm `status`.
- Service:
  - Đổi chữ ký `StationService#getCurrentStaffStation` trả `MyStationResponse`.
  - `StationServiceImpl`: kiểm tra user tồn tại, quyền (`STAFF` hoặc `ADMIN`), lấy `station` → 404 nếu thiếu; truy vấn xe theo `stationId`, map sang `VehicleResponse` rút gọn + `status`.
- Controller: `GET /station/me` trả `ApiResponse<MyStationResponse>`; bỏ try/catch để `GlobalExceptionHandler` xử lý lỗi.

5) Testing (gợi ý)
- 200 OK (STAFF/ADMIN có station): body chứa 3 cột trạm + mảng `vehicles` mỗi phần tử có `plateNumber`, `color`, `modelName`, `brand`, `status`.
- 404 Not Found: user không tồn tại hoặc chưa được gán station.
- 403 Forbidden: role không phải STAFF/ADMIN (bị chặn ở SecurityConfig).
- 401 Unauthorized: thiếu/sai JWT.

6) Troubleshooting
- Nếu `vehicles` rỗng: kiểm tra dữ liệu xe gắn với `stationId`.
- Nếu ADMIN không có station: nhận 404 là hợp lý theo nghiệp vụ hiện tại.
- Nếu response không map `status`: kiểm tra lại `VehicleMapper.toShortVehicleResponse` đã thêm mapping `status`.

7) Customization/Advanced
- Có thể thêm phân trang/lọc xe (status, model, color).
- Tách DTO `VehicleShortResponse` riêng để làm rõ hợp đồng trả về nếu cần.
- Hoàn thiện `GlobalExceptionHandler` để map `ResourceNotFoundException` → HTTP 404, `BusinessException` → 400.

8) Next steps
- [ ] Bổ sung test MockMvc cho `/station/me` (happy path + 404 + 403 + 401).
- [ ] Cân nhắc xoá matcher không cần thiết `"/EVRental/**"` trong `SecurityConfig`.
- [ ] Đồng bộ README về endpoint mới.
