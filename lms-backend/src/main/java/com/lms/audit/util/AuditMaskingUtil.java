package com.lms.audit.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.auth.dto.LoginRequest;

import java.util.*;

public final class AuditMaskingUtil {

    private static final Set<String> SENSITIVE_FIELDS = Set.of(
            "password",
            "token",
            "accesstoken",
            "refreshtoken",
            "aadhaarnumber",
            "pannumber",
            "email",
            "proofofidentity",
            "proofofincome",
            "proofofaddress",
            "proofofbusiness",
            "proofofadmission",
            "insuranceproof",
            "downpaymentproof",
            "collateraldocuments",
            "documents"
    );

    private static final ObjectMapper mapper = new ObjectMapper();

    private AuditMaskingUtil() {}

    public static String mask(Object obj) {
        if (obj == null) return "{}";

        try {
            // If already a string (JSON or otherwise), don’t re-mask blindly
            if (obj instanceof String s) {
                return s;
            }

            Map<String, Object> map =
                    mapper.convertValue(obj, new TypeReference<>() {});

            maskRecursive(map);
            return mapper.writeValueAsString(map);

        } catch (Exception e) {
            // LOG THIS — swallowing errors hides bugs
            return "{}";
        }
    }

    public static String maskLoginRequest(LoginRequest req) {
        if (req == null) return "{}";

        return """
        {
          "usernameOrEmail": "%s",
          "password": "***MASKED***"
        }
        """.formatted(req.getUsernameOrEmail());
    }

    @SuppressWarnings("unchecked")
    private static void maskRecursive(Map<String, Object> map) {
        for (Map.Entry<String, Object> entry : new HashMap<>(map).entrySet()) {
            String key = entry.getKey();
            Object val = entry.getValue();

            if (key == null) continue;

            if (SENSITIVE_FIELDS.contains(key.toLowerCase())) {
                map.put(key, "***MASKED***");
            }
            else if (val instanceof Map<?, ?> nestedMap) {
                maskRecursive((Map<String, Object>) nestedMap);
            }
            else if (val instanceof Collection<?> collection) {
                for (Object item : collection) {
                    if (item instanceof Map<?, ?> m) {
                        maskRecursive((Map<String, Object>) m);
                    }
                }
            }
        }
    }
}


