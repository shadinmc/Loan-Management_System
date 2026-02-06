package com.lms.loan.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class VehicleLoanDetailsDto {

    private String vehicleType; // CAR / BIKE
    private String vehicleBrand;
    private String vehicleModel;

    private BigDecimal downPaymentAmount;
    private String dealerName;

    private String proofOfIdentity;
    private String proofOfIncome;
    private String insuranceProof;
    private String downPaymentProof;
}
