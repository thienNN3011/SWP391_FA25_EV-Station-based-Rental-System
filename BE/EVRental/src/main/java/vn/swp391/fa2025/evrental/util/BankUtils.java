package vn.swp391.fa2025.evrental.util;

public class BankUtils {
    public static boolean isValidBankAccount(String bankAccount) {
        if (bankAccount == null || bankAccount.isEmpty()) {
            return false;
        }
        return bankAccount.matches("\\d+");
    }
}
