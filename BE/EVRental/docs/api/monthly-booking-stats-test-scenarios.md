# Test Scenarios for Monthly Booking Statistics API

## Test Setup

### Prerequisites
1. Database có ít nhất 2 trạm (stations)
2. Có booking với status COMPLETED trong các tháng khác nhau
3. JWT token hợp lệ cho testing

### Test Data Setup

```sql
-- Giả sử có 3 trạm
Station 1: "Trạm Sạc Trung Tâm" (stationId = 1)
Station 2: "Trạm Sạc Quận 1" (stationId = 2)
Station 3: "Trạm Sạc Quận 7" (stationId = 3)

-- Bookings hoàn thành trong tháng 11/2025
- 5 bookings tại Station 1 (actualEndTime trong khoảng 2025-11-01 đến 2025-11-30)
- 3 bookings tại Station 2 (actualEndTime trong khoảng 2025-11-01 đến 2025-11-30)
- 7 bookings tại Station 3 (actualEndTime trong khoảng 2025-11-01 đến 2025-11-30)

-- Bookings hoàn thành trong tháng 10/2025
- 4 bookings tại Station 1
- 2 bookings tại Station 2
- 5 bookings tại Station 3
```

---

## Test Cases

### Test Case 1: Lấy thống kê tất cả trạm - Tháng có dữ liệu

**Request:**
```json
POST /bookings/stats/monthly-completed
{
  "month": 11,
  "year": 2025,
  "stationId": null
}
```

**Expected Response:**
```json
{
  "success": true,
  "code": 200,
  "message": "Lấy thống kê booking hoàn thành tháng 11/2025 (tất cả trạm) thành công",
  "data": {
    "month": 11,
    "year": 2025,
    "totalCompletedBookings": 15,
    "stationName": null,
    "stationBreakdown": [
      {
        "stationId": 1,
        "stationName": "Trạm Sạc Trung Tâm",
        "completedBookings": 5
      },
      {
        "stationId": 2,
        "stationName": "Trạm Sạc Quận 1",
        "completedBookings": 3
      },
      {
        "stationId": 3,
        "stationName": "Trạm Sạc Quận 7",
        "completedBookings": 7
      }
    ]
  }
}
```

**Validation:**
- ✅ totalCompletedBookings = 15 (5 + 3 + 7)
- ✅ stationBreakdown có 3 items
- ✅ stationName = null
- ✅ Sum của completedBookings trong breakdown = totalCompletedBookings

---

### Test Case 2: Lấy thống kê một trạm cụ thể

**Request:**
```json
POST /bookings/stats/monthly-completed
{
  "month": 11,
  "year": 2025,
  "stationId": 1
}
```

**Expected Response:**
```json
{
  "success": true,
  "code": 200,
  "message": "Lấy thống kê booking hoàn thành tháng 11/2025 tại trạm Trạm Sạc Trung Tâm thành công",
  "data": {
    "month": 11,
    "year": 2025,
    "totalCompletedBookings": 5,
    "stationName": "Trạm Sạc Trung Tâm",
    "stationBreakdown": null
  }
}
```

**Validation:**
- ✅ totalCompletedBookings = 5
- ✅ stationName = "Trạm Sạc Trung Tâm"
- ✅ stationBreakdown = null

---

### Test Case 3: Tháng không có booking hoàn thành

**Request:**
```json
POST /bookings/stats/monthly-completed
{
  "month": 1,
  "year": 2024,
  "stationId": null
}
```

**Expected Response:**
```json
{
  "success": true,
  "code": 200,
  "message": "Không có booking hoàn thành nào trong tháng 1/2024",
  "data": {
    "month": 1,
    "year": 2024,
    "totalCompletedBookings": 0,
    "stationName": null,
    "stationBreakdown": []
  }
}
```

**Validation:**
- ✅ totalCompletedBookings = 0
- ✅ stationBreakdown = empty array
- ✅ Message phản ánh không có dữ liệu

---

### Test Case 4: Validation Error - Invalid Month (< 1)

**Request:**
```json
POST /bookings/stats/monthly-completed
{
  "month": 0,
  "year": 2025,
  "stationId": null
}
```

**Expected Response:**
```json
{
  "success": false,
  "code": 400,
  "message": "Tháng phải từ 1 đến 12",
  "data": null
}
```

---

### Test Case 5: Validation Error - Invalid Month (> 12)

**Request:**
```json
POST /bookings/stats/monthly-completed
{
  "month": 13,
  "year": 2025,
  "stationId": null
}
```

**Expected Response:**
```json
{
  "success": false,
  "code": 400,
  "message": "Tháng phải từ 1 đến 12",
  "data": null
}
```

---

### Test Case 6: Validation Error - Invalid Year

**Request:**
```json
POST /bookings/stats/monthly-completed
{
  "month": 11,
  "year": 1999,
  "stationId": null
}
```

**Expected Response:**
```json
{
  "success": false,
  "code": 400,
  "message": "Năm phải lớn hơn hoặc bằng 2000",
  "data": null
}
```

---

### Test Case 7: Station Not Found

**Request:**
```json
POST /bookings/stats/monthly-completed
{
  "month": 11,
  "year": 2025,
  "stationId": 999
}
```

**Expected Response:**
```json
{
  "success": false,
  "code": 404,
  "message": "Không tìm thấy trạm với ID: 999",
  "data": null
}
```

---

### Test Case 8: Missing Required Field - Month

**Request:**
```json
POST /bookings/stats/monthly-completed
{
  "year": 2025,
  "stationId": null
}
```

**Expected Response:**
```json
{
  "success": false,
  "code": 400,
  "message": "Tháng không được để trống",
  "data": null
}
```

---

### Test Case 9: Missing Required Field - Year

**Request:**
```json
POST /bookings/stats/monthly-completed
{
  "month": 11,
  "stationId": null
}
```

**Expected Response:**
```json
{
  "success": false,
  "code": 400,
  "message": "Năm không được để trống",
  "data": null
}
```

---

### Test Case 10: Unauthorized - No Token

**Request:**
```bash
curl -X POST "http://localhost:8080/EVRental/bookings/stats/monthly-completed" \
  -H "Content-Type: application/json" \
  -d '{
    "month": 11,
    "year": 2025
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "code": 401,
  "message": "Unauthorized",
  "data": null
}
```

---

### Test Case 11: Edge Case - Tháng 2 (28/29 ngày)

**Request:**
```json
POST /bookings/stats/monthly-completed
{
  "month": 2,
  "year": 2024,
  "stationId": null
}
```

**Expected Behavior:**
- Lọc từ 2024-02-01 00:00:00 đến 2024-03-01 00:00:00
- Năm 2024 là năm nhuận (29 ngày)
- Phải tính đúng tất cả booking trong 29 ngày

---

### Test Case 12: Edge Case - Booking vào đúng 00:00:00 đầu tháng

**Setup:**
- Booking có actualEndTime = 2025-11-01 00:00:00

**Request:**
```json
POST /bookings/stats/monthly-completed
{
  "month": 11,
  "year": 2025,
  "stationId": null
}
```

**Expected:**
- Booking này PHẢI được tính (>= startDate)

---

### Test Case 13: Edge Case - Booking vào đúng 23:59:59 cuối tháng

**Setup:**
- Booking có actualEndTime = 2025-11-30 23:59:59

**Request:**
```json
POST /bookings/stats/monthly-completed
{
  "month": 11,
  "year": 2025,
  "stationId": null
}
```

**Expected:**
- Booking này PHẢI được tính (< endDate = 2025-12-01 00:00:00)

---

### Test Case 14: Edge Case - Booking vào đúng 00:00:00 đầu tháng sau

**Setup:**
- Booking có actualEndTime = 2025-12-01 00:00:00

**Request:**
```json
POST /bookings/stats/monthly-completed
{
  "month": 11,
  "year": 2025,
  "stationId": null
}
```

**Expected:**
- Booking này KHÔNG được tính (>= endDate)

---

## Manual Testing Checklist

- [ ] Test Case 1: All stations with data
- [ ] Test Case 2: Single station with data
- [ ] Test Case 3: Month with no data
- [ ] Test Case 4: Invalid month (< 1)
- [ ] Test Case 5: Invalid month (> 12)
- [ ] Test Case 6: Invalid year
- [ ] Test Case 7: Station not found
- [ ] Test Case 8: Missing month field
- [ ] Test Case 9: Missing year field
- [ ] Test Case 10: No authentication token
- [ ] Test Case 11: February (leap year)
- [ ] Test Case 12: Boundary - start of month
- [ ] Test Case 13: Boundary - end of month
- [ ] Test Case 14: Boundary - start of next month

---

## Performance Testing

### Load Test Scenario
- Concurrent requests: 100
- Duration: 1 minute
- Expected response time: < 500ms
- Expected success rate: 100%

### Database Query Performance
- Query 1 (count all): Should use index on (status, actualEndTime)
- Query 2 (count by station): Should use index on (status, actualEndTime, vehicle.station.stationId)
- Query 3 (breakdown): Should use JOIN efficiently

---

## Integration Testing Notes

1. **Database State**: Ensure test database has consistent data
2. **Time Zone**: Verify LocalDateTime handling is correct
3. **Transaction Isolation**: Test concurrent requests don't interfere
4. **Cache**: If caching is added, verify cache invalidation
5. **Logging**: Check logs for query execution time

---

## Automated Test Example (JUnit)

```java
@Test
public void testGetMonthlyStats_AllStations_Success() {
    MonthlyBookingStatsRequest request = new MonthlyBookingStatsRequest(11, 2025, null);
    MonthlyBookingStatsResponse response = bookingService.getMonthlyCompletedBookingsStats(request);
    
    assertNotNull(response);
    assertEquals(11, response.getMonth());
    assertEquals(2025, response.getYear());
    assertTrue(response.getTotalCompletedBookings() >= 0);
    assertNull(response.getStationName());
    assertNotNull(response.getStationBreakdown());
}
```

