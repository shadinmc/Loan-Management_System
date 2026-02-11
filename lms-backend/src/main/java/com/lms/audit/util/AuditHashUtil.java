package com.lms.audit.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

public class AuditHashUtil {

    private AuditHashUtil() {}

    public static String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));

            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to compute audit hash", e);
        }
    }
}
