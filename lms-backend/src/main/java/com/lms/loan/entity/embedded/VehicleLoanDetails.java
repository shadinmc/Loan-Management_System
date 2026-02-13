package com.lms.loan.entity.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import org.bson.types.Binary;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleLoanDetails {

    private String vehicleType;
    private String vehicleBrand;
    private String vehicleModel;

    private BigDecimal downPaymentAmount;
    private String dealerName;

    private Binary proofOfIdentity;
    private Binary proofOfIncome;
    private Binary insuranceProof;
    private Binary downPaymentProof;
}
