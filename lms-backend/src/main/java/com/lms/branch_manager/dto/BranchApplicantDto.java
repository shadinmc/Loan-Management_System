package com.lms.branch_manager.dto;

public record BranchApplicantDto(
        String name,
        String email,
        String phone,
        String panMasked,
        String aadhaarMasked
) {}
