package com.lms.audit.util;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;
import java.util.Set;

public class AuditMaskingUtil {

    private static final Set<String> SENSITIVE_FIELDS = Set.of(
            "aadhaar", "pan",
            "proofOfIdentity", "proofOfIncome", "proofOfAddress",
            "insuranceProof", "downPaymentProof", "collateralDocuments"
    );

    private static final ObjectMapper mapper = new ObjectMapper();

    @SuppressWarnings("unchecked")
    public static String mask(Object obj) {
        try {
            Map<String, Object> map = mapper.convertValue(obj, Map.class);
            maskRecursive(map);
            return mapper.writeValueAsString(map);
        } catch (Exception e) {
            return "{}";
        }
    }

    private static void maskRecursive(Map<String, Object> map) {
        for (String key : map.keySet()) {
            Object val = map.get(key);

            if (SENSITIVE_FIELDS.contains(key.toLowerCase())) {
                map.put(key, "***MASKED***");
            } else if (val instanceof Map) {
                maskRecursive((Map<String, Object>) val);
            }
        }
    }
}
