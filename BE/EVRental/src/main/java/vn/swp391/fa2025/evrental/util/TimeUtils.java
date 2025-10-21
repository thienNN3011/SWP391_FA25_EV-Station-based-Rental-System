package vn.swp391.fa2025.evrental.util;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public class TimeUtils {
    public static long ceilTimeDiff(LocalDateTime t1, LocalDateTime t2, String unit) {
        if (t1.isBefore(t2)) {
            LocalDateTime temp = t1;
            t1 = t2;
            t2 = temp;
        }

        long hours = ChronoUnit.HOURS.between(t2, t1);
        double result;

        switch (unit.toLowerCase()) {
            case "hour":
            case "hours":
            case "giờ":
                result = hours;
                break;

            case "day":
            case "days":
            case "ngày":
                result = hours / 24.0;
                break;

            case "week":
            case "weeks":
            case "tuần":
                result = hours / (24.0 * 7);
                break;

            case "month":
            case "months":
            case "tháng":
                result = hours / (24.0 * 30);
                break;

            default:
                throw new IllegalArgumentException("Đơn vị không hợp lệ: " + unit);
        }

        return (long) Math.ceil(result);
    }
}
