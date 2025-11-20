# Monthly Completed Bookings Statistics API

## Overview
API endpoint để lấy thống kê tổng số lượng đơn thuê (booking) đã hoàn thành trong một tháng cụ thể.

---

## Endpoint

### POST /bookings/stats/monthly-completed

Lấy thống kê số lượng booking đã hoàn thành trong một tháng, có thể lọc theo trạm hoặc lấy tất cả trạm.

**URL**: `POST /bookings/stats/monthly-completed`

**Authentication**: Required (JWT Token)

**Permissions**: ADMIN, STAFF, RENTER (tùy theo role sẽ thấy dữ liệu khác nhau)

---

## Request Structure

### Request Body (JSON)

```json
{
  "month": 11,
  "year": 2025,
  "stationId": 1
}
```

### Request Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `month` | `Integer` | Yes | 1-12 | Tháng cần thống kê (1 = Tháng 1, 12 = Tháng 12) |
| `year` | `Integer` | Yes | >= 2000 | Năm cần thống kê |
| `stationId` | `Long` | No | - | ID của trạm (null = tất cả trạm) |

---

## Response Structure

### Case 1: Lọc theo một trạm cụ thể (stationId != null)

```json
{
  "success": true,
  "code": 200,
  "message": "Lấy thống kê booking hoàn thành tháng 11/2025 tại trạm Trạm Sạc Trung Tâm thành công",
  "data": {
    "month": 11,
    "year": 2025,
    "totalCompletedBookings": 45,
    "stationName": "Trạm Sạc Trung Tâm",
    "stationBreakdown": null
  }
}
```

### Case 2: Lấy tất cả trạm (stationId = null)

```json
{
  "success": true,
  "code": 200,
  "message": "Lấy thống kê booking hoàn thành tháng 11/2025 (tất cả trạm) thành công",
  "data": {
    "month": 11,
    "year": 2025,
    "totalCompletedBookings": 150,
    "stationName": null,
    "stationBreakdown": [
      {
        "stationId": 1,
        "stationName": "Trạm Sạc Trung Tâm",
        "completedBookings": 45
      },
      {
        "stationId": 2,
        "stationName": "Trạm Sạc Quận 1",
        "completedBookings": 38
      },
      {
        "stationId": 3,
        "stationName": "Trạm Sạc Quận 7",
        "completedBookings": 67
      }
    ]
  }
}
```

### Case 3: Không có booking hoàn thành

```json
{
  "success": true,
  "code": 200,
  "message": "Không có booking hoàn thành nào trong tháng 11/2025",
  "data": {
    "month": 11,
    "year": 2025,
    "totalCompletedBookings": 0,
    "stationName": null,
    "stationBreakdown": []
  }
}
```

---

## Response Fields

### MonthlyBookingStatsResponse

| Field | Type | Description |
|-------|------|-------------|
| `month` | `Integer` | Tháng được thống kê |
| `year` | `Integer` | Năm được thống kê |
| `totalCompletedBookings` | `Long` | Tổng số booking đã hoàn thành |
| `stationName` | `String` | Tên trạm (null nếu lấy tất cả trạm) |
| `stationBreakdown` | `Array<StationBookingStats>` | Chi tiết theo từng trạm (null nếu lọc theo 1 trạm) |

### StationBookingStats (trong stationBreakdown)

| Field | Type | Description |
|-------|------|-------------|
| `stationId` | `Long` | ID của trạm |
| `stationName` | `String` | Tên trạm |
| `completedBookings` | `Long` | Số booking hoàn thành tại trạm này |

---

## Business Logic

### Điều kiện để booking được tính là "COMPLETED"

1. **Status**: `booking.status = 'COMPLETED'`
2. **Thời gian hoàn thành**: `booking.actualEndTime` nằm trong khoảng thời gian của tháng được chọn
   - Start: `YYYY-MM-01 00:00:00`
   - End: `YYYY-(MM+1)-01 00:00:00` (exclusive)

### Ví dụ:
- Request: `month=11, year=2025`
- Lọc: `actualEndTime >= 2025-11-01 00:00:00 AND actualEndTime < 2025-12-01 00:00:00`

### Database Query Flow

#### Query 1: Count tất cả trạm
```sql
SELECT COUNT(b)
FROM Booking b
WHERE b.status = 'COMPLETED'
  AND b.actualEndTime >= :startDate
  AND b.actualEndTime < :endDate
```

#### Query 2: Count theo trạm cụ thể
```sql
SELECT COUNT(b)
FROM Booking b
WHERE b.status = 'COMPLETED'
  AND b.actualEndTime >= :startDate
  AND b.actualEndTime < :endDate
  AND b.vehicle.station.stationId = :stationId
```

#### Query 3: Breakdown theo từng trạm
```sql
SELECT s.stationId, s.stationName, COUNT(b.bookingId)
FROM Booking b
JOIN b.vehicle v
JOIN v.station s
WHERE b.status = 'COMPLETED'
  AND b.actualEndTime >= :startDate
  AND b.actualEndTime < :endDate
GROUP BY s.stationId, s.stationName
ORDER BY s.stationName
```

---

## Example Requests

### Example 1: Lấy thống kê tất cả trạm trong tháng 11/2025

```bash
curl -X POST "http://localhost:8080/EVRental/bookings/stats/monthly-completed" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "month": 11,
    "year": 2025,
    "stationId": null
  }'
```

### Example 2: Lấy thống kê trạm ID=1 trong tháng 10/2025

```bash
curl -X POST "http://localhost:8080/EVRental/bookings/stats/monthly-completed" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "month": 10,
    "year": 2025,
    "stationId": 1
  }'
```

### Example 3: Lấy thống kê tháng hiện tại

```bash
curl -X POST "http://localhost:8080/EVRental/bookings/stats/monthly-completed" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "month": 11,
    "year": 2025
  }'
```

---

## Error Responses

### 400 Bad Request - Invalid Month

```json
{
  "success": false,
  "code": 400,
  "message": "Tháng phải từ 1 đến 12",
  "data": null
}
```

### 400 Bad Request - Invalid Year

```json
{
  "success": false,
  "code": 400,
  "message": "Năm phải lớn hơn hoặc bằng 2000",
  "data": null
}
```

### 404 Not Found - Station Not Found

```json
{
  "success": false,
  "code": 404,
  "message": "Không tìm thấy trạm với ID: 999",
  "data": null
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "code": 401,
  "message": "Unauthorized - Token không hợp lệ hoặc đã hết hạn",
  "data": null
}
```

---

## Use Cases

### 1. Dashboard Admin - Xem tổng quan hệ thống
- Admin muốn xem tổng số booking hoàn thành trong tháng hiện tại
- Request: `stationId = null`
- Response: Tổng số + breakdown theo từng trạm

### 2. Staff Manager - Xem hiệu suất trạm
- Staff manager muốn xem số booking hoàn thành tại trạm của mình
- Request: `stationId = <station_id_of_staff>`
- Response: Số lượng booking của trạm đó

### 3. Báo cáo tháng
- Tạo báo cáo cuối tháng về số lượng đơn hoàn thành
- Request: `month = <previous_month>, year = <year>`
- Response: Dữ liệu để tạo báo cáo

### 4. So sánh hiệu suất giữa các trạm
- Admin muốn so sánh hiệu suất giữa các trạm
- Request: `stationId = null`
- Response: Breakdown cho phép so sánh

---

## Technical Implementation

### Files Created/Modified

1. **DTO Request**: `MonthlyBookingStatsRequest.java`
2. **DTO Response**: `MonthlyBookingStatsResponse.java`
3. **Repository**: `BookingRepository.java` (added 3 query methods)
4. **Service Interface**: `BookingService.java` (added method signature)
5. **Service Implementation**: `BookingServiceImpl.java` (implemented logic)
6. **Controller**: `BookingController.java` (added endpoint)

### Key Technologies
- Spring Boot REST API
- JPA/JPQL Queries
- Jakarta Validation
- Spring Security (JWT Authentication)
- Lombok (Builder pattern)

---

## Notes

- API này sử dụng `actualEndTime` (thời gian thực tế kết thúc) thay vì `endTime` (thời gian dự kiến)
- Chỉ tính các booking có status = 'COMPLETED'
- Breakdown được sắp xếp theo tên trạm (alphabetically)
- Response luôn trả về success=true ngay cả khi count=0

