package com.example.FoodApp.dto;

import com.example.FoodApp.enums.OrderStatus;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    private OrderStatus status;
}
