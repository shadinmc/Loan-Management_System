package com.lms.branch_manager.dto;

import java.util.List;

public record BranchLoanPageResponse(
        List<BranchLoanReviewDto> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last
) {}
