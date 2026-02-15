package com.lms.disbursement.dto;

import java.util.List;

public record DisbursementPageResponse(
        List<DisbursementResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last
) {}
