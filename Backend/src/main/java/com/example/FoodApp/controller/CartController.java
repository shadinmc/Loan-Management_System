package com.example.FoodApp.controller;

import com.example.FoodApp.dto.CheckoutRequest;
import com.example.FoodApp.dto.UpdateOrderStatusRequest;
import com.example.FoodApp.model.Cart;
import com.example.FoodApp.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@CrossOrigin
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // USER: CHECKOUT
    @PostMapping("/checkout")
    public Cart checkout(@RequestBody CheckoutRequest request) {
        return cartService.checkout(request);
    }

    // USER: VIEW OWN ORDERS
    @GetMapping("/user/{userId}")
    public List<Cart> getUserOrders(@PathVariable String userId) {
        return cartService.getUserOrders(userId);
    }

    // ADMIN: VIEW ALL ORDERS
    @GetMapping("/admin")
    public List<Cart> getAllOrders(@RequestParam String adminId) {
        return cartService.getAllOrders(adminId);
    }

    // ADMIN: UPDATE STATUS
    @PutMapping("/{orderId}/status")
    public Cart updateStatus(
            @RequestParam String adminId,
            @PathVariable String orderId,
            @RequestBody UpdateOrderStatusRequest request) {

        return cartService.updateOrderStatus(adminId, orderId, request);
    }
}

