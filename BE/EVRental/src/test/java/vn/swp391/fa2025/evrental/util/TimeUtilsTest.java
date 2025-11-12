package vn.swp391.fa2025.evrental.util;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class TimeUtilsTest {

    // =========================================
    // TEST THEO ĐÚNG NGHIỆP VỤ: 24h1p = 2 ngày
    // =========================================

    @Test
    void testCeilTimeDiff_Days_24Hours1Minute_ShouldReturn2Days() {
        // Arrange: 24 giờ 1 phút
        LocalDateTime start = LocalDateTime.of(2024, 1, 1, 10, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 1, 2, 10, 1, 0);

        // Act
        long result = TimeUtils.ceilTimeDiff(end, start, "day");

        // Assert: Theo nghiệp vụ phải là 2 ngày
        assertEquals(2, result, "24h1p phải tính là 2 ngày theo nghiệp vụ");
    }

    @Test
    void testCeilTimeDiff_Days_23Hours59Minutes_ShouldReturn1Day() {
        // Arrange: 23 giờ 59 phút
        LocalDateTime start = LocalDateTime.of(2024, 1, 1, 10, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 1, 2, 9, 59, 0);

        // Act
        long result = TimeUtils.ceilTimeDiff(end, start, "day");

        // Assert
        assertEquals(1, result, "23h59p phải tính là 1 ngày");
    }

    @Test
    void testCeilTimeDiff_Days_Exact24Hours_ShouldReturn1Day() {
        // Arrange: Chính xác 24 giờ
        LocalDateTime start = LocalDateTime.of(2024, 1, 1, 10, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 1, 2, 10, 0, 0);

        // Act
        long result = TimeUtils.ceilTimeDiff(end, start, "day");

        // Assert
        assertEquals(1, result, "24h chính xác phải tính là 1 ngày");
    }

    @Test
    void testCeilTimeDiff_Days_1Minute_ShouldReturn1Day() {
        // Arrange: Chỉ 1 phút
        LocalDateTime start = LocalDateTime.of(2024, 1, 1, 10, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 1, 1, 10, 1, 0);

        // Act
        long result = TimeUtils.ceilTimeDiff(end, start, "day");

        // Assert
        assertEquals(1, result, "1 phút phải tính là 1 ngày (làm tròn lên)");
    }

    @Test
    void testCeilTimeDiff_Days_47Hours59Minutes_ShouldReturn2Days() {
        // Arrange: 1 ngày 23h59p
        LocalDateTime start = LocalDateTime.of(2024, 1, 1, 10, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 1, 3, 9, 59, 0);

        // Act
        long result = TimeUtils.ceilTimeDiff(end, start, "day");

        // Assert
        assertEquals(2, result, "47h59p phải tính là 2 ngày");
    }

    @Test
    void testCeilTimeDiff_Days_48Hours1Minute_ShouldReturn3Days() {
        // Arrange: 2 ngày 1 phút
        LocalDateTime start = LocalDateTime.of(2024, 1, 1, 10, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 1, 3, 10, 1, 0);

        // Act
        long result = TimeUtils.ceilTimeDiff(end, start, "day");

        // Assert
        assertEquals(3, result, "48h1p phải tính là 3 ngày");
    }

    // =========================================
    // TEST CÁC ĐƠN VỊ KHÁC THEO CÙNG LOGIC
    // =========================================

    @Test
    void testCeilTimeDiff_Hours_1Minute_ShouldReturn1Hour() {
        // Arrange: 1 phút
        LocalDateTime start = LocalDateTime.of(2024, 1, 1, 10, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 1, 1, 10, 1, 0);

        // Act
        long result = TimeUtils.ceilTimeDiff(end, start, "hour");

        // Assert
        assertEquals(1, result, "1 phút phải tính là 1 giờ");
    }

    @Test
    void testCeilTimeDiff_Hours_59Minutes_ShouldReturn1Hour() {
        // Arrange: 59 phút
        LocalDateTime start = LocalDateTime.of(2024, 1, 1, 10, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 1, 1, 10, 59, 0);

        // Act
        long result = TimeUtils.ceilTimeDiff(end, start, "hour");

        // Assert
        assertEquals(1, result, "59 phút phải tính là 1 giờ");
    }

    @Test
    void testCeilTimeDiff_Hours_61Minutes_ShouldReturn2Hours() {
        // Arrange: 1 giờ 1 phút
        LocalDateTime start = LocalDateTime.of(2024, 1, 1, 10, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 1, 1, 11, 1, 0);

        // Act
        long result = TimeUtils.ceilTimeDiff(end, start, "hour");

        // Assert
        assertEquals(2, result, "1h1p phải tính là 2 giờ");
    }

    @Test
    void testCeilTimeDiff_Weeks_7Days1Minute_ShouldReturn2Weeks() {
        // Arrange: 7 ngày 1 phút
        LocalDateTime start = LocalDateTime.of(2024, 1, 1, 10, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 1, 8, 10, 1, 0);

        // Act
        long result = TimeUtils.ceilTimeDiff(end, start, "week");

        // Assert
        assertEquals(2, result, "7 ngày 1 phút phải tính là 2 tuần");
    }

    @Test
    void testCeilTimeDiff_Months_30Days1Minute_ShouldReturn2Months() {
        // Arrange: 30 ngày 1 phút
        LocalDateTime start = LocalDateTime.of(2024, 1, 1, 10, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 1, 31, 10, 1, 0); // 30 ngày

        // Act
        long result = TimeUtils.ceilTimeDiff(end, start, "month");

        // Assert
        assertEquals(2, result, "30 ngày 1 phút phải tính là 2 tháng");
    }

    // =========================================
    // TEST TIẾNG VIỆT & EDGE CASES
    // =========================================

    @Test
    void testCeilTimeDiff_VietnameseUnits_StrictLogic() {
        LocalDateTime start = LocalDateTime.of(2024, 1, 1, 10, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 1, 1, 10, 1, 0); // 1 phút

        assertEquals(1, TimeUtils.ceilTimeDiff(end, start, "giờ"));
        assertEquals(1, TimeUtils.ceilTimeDiff(end, start, "ngày"));
        assertEquals(1, TimeUtils.ceilTimeDiff(end, start, "tuần"));
        assertEquals(1, TimeUtils.ceilTimeDiff(end, start, "tháng"));
    }

    @Test
    void testCeilTimeDiff_SameTime_ShouldReturn0() {
        LocalDateTime time = LocalDateTime.of(2024, 1, 1, 10, 0, 0);

        long result = TimeUtils.ceilTimeDiff(time, time, "day");

        assertEquals(0, result, "Cùng thời điểm phải return 0");
    }

    @Test
    void testCeilTimeDiff_AutoSwapParameters() {
        LocalDateTime earlier = LocalDateTime.of(2024, 1, 1, 10, 0, 0);
        LocalDateTime later = LocalDateTime.of(2024, 1, 2, 10, 1, 0);

        // Truyền sai thứ tự
        long result = TimeUtils.ceilTimeDiff(earlier, later, "day");

        assertEquals(2, result, "Phải tự động swap và tính là 2 ngày");
    }

    // =========================================
    // TEST PAYDATE METHODS
    // =========================================

    @Test
    void testParsePayDate_ValidFormat() {
        String payDate = "20240115143045";
        LocalDateTime result = TimeUtils.parsePayDate(payDate);

        LocalDateTime expected = LocalDateTime.of(2024, 1, 15, 14, 30, 45);
        assertEquals(expected, result);
    }

    @Test
    void testFormatPayDate_ValidDateTime() {
        LocalDateTime dateTime = LocalDateTime.of(2024, 1, 15, 14, 30, 45);
        String result = TimeUtils.formatPayDate(dateTime);

        assertEquals("20240115143045", result);
    }

    @Test
    void testFormatPayDate_Null_ShouldReturnNull() {
        String result = TimeUtils.formatPayDate(null);
        assertNull(result);
    }

    @Test
    void testRoundTrip_ParseAndFormat() {
        String original = "20241231235959";
        LocalDateTime parsed = TimeUtils.parsePayDate(original);
        String formatted = TimeUtils.formatPayDate(parsed);

        assertEquals(original, formatted);
    }
}