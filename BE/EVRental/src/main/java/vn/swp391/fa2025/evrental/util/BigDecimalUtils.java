package vn.swp391.fa2025.evrental.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class BigDecimalUtils {
    public static BigDecimal roundUpToIntegerWithTwoDecimals(BigDecimal value) {
        if (value == null) {
            return BigDecimal.ZERO.setScale(2);
        }
        BigDecimal rounded = value.setScale(0, RoundingMode.UP);
        return rounded.setScale(2, RoundingMode.UNNECESSARY);
    }
}
