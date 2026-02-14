package com.lms.repayment.dto;

import java.util.List;

public record ManagerLoanClosurePageResponse(
        List<ManagerLoanClosureResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last
) {}
