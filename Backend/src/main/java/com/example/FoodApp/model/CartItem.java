package com.example.FoodApp.model;

import lombok.Data;

@Data
public class CartItem {

    private String foodName;
    private int quantity;
    private double price;
}
