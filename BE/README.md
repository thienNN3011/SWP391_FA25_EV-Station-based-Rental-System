# Backend Notes

## Staff account API
- **Endpoint**: `POST /EVRental/admin/staffs` (JWT `ADMIN` required). Body = JSON `CreateStaffRequest` bao gồm username/password/fullName/email/phone và optional `idCard`, `driveLicense`, `idCardPhoto`, `driveLicensePhoto`, `stationId`.
- **Behaviour**: Service mã hoá password bằng `PasswordEncoder`, set role `STAFF`, status `ACTIVE`, gán station `OPEN` theo `stationId` (nếu truyền). Không gửi email nên FE phải tự thông báo thông tin đăng nhập nội bộ.
- **Storage note**: URL ảnh từ Supabase được lưu thẳng vào `users.idCardPhoto` / `users.driveLicensePhoto`. Đảm bảo FE upload trước khi gọi API.
- **Conflict cases**: 409/400 khi trùng username/email/phone/idCard/driveLicense hoặc station không tồn tại/còn đóng.
- **Quick test**:
  ```bash
  cd BE/EVRental
  ./mvnw spring-boot:run
  curl -X POST http://localhost:8080/EVRental/admin/staffs \
    -H "Authorization: Bearer <ADMIN_JWT>" \
    -H "Content-Type: application/json" \
    -d '{ "username":"staff.demo","password":"Secret@123","fullName":"Staff Demo","email":"staff.demo@example.com","phone":"+84111222333","stationId":1 }'
  ```
