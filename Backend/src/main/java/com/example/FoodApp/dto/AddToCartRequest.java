package com.example.FoodApp.dto;

import lombok.Data;

@Data
public class AddToCartRequest {
    private String foodName;
    private int quantity;
    private double price;
}
