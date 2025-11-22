package vn.swp391.fa2025.evrental.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

public class TimeUtils {
    public static long ceilTimeDiff(LocalDateTime t1, LocalDateTime t2, String unit) {
        if (t1.isBefore(t2)) {
            LocalDateTime temp = t1;
            t1 = t2;
            t2 = temp;
        }

        long minutes = ChronoUnit.MINUTES.between(t2, t1);
        double result;

        switch (unit.toLowerCase()) {
            case "hour":
            case "hours":
            case "hourly":
            case "giờ":
                result = minutes / 60.0;
                break;

            case "day":
            case "days":
            case "daily":
            case "ngày":
                result = minutes / (60.0 * 24);
                break;

            case "week":
            case "weeks":
            case "weekly":
            case "tuần":
                result = minutes / (60.0 * 24 * 7);
                break;

            case "month":
            case "months":
            case "monthly":
            case "tháng":
                result = minutes / (60.0 * 24 * 30);
                break;

            default:
                throw new IllegalArgumentException("Đơn vị không hợp lệ: " + unit);
        }

        return (long) Math.ceil(result);
    }

    public static LocalDateTime parsePayDate(String payDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        return LocalDateTime.parse(payDate, formatter);
    }
    public static String formatPayDate(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        return dateTime.format(formatter);
    }

}
