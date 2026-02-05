package com.lms.loan.entity.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleLoanDetails {

    private String vehicleType;
    private String vehicleBrand;
    private String vehicleModel;

    private Double downPaymentAmount;
    private String dealerName;

    private String proofOfIdentity;
    private String proofOfIncome;
    private String insuranceProof;
    private String downPaymentProof;
}
