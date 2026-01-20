package com.example.FoodApp.service;

import com.example.FoodApp.dto.AddToCartRequest;
import com.example.FoodApp.dto.CheckoutRequest;
import com.example.FoodApp.dto.UpdateOrderStatusRequest;
import com.example.FoodApp.enums.OrderStatus;
import com.example.FoodApp.enums.Role;
import com.example.FoodApp.model.Cart;
import com.example.FoodApp.model.CartItem;
import com.example.FoodApp.model.User;
import com.example.FoodApp.repository.CartRepository;
import com.example.FoodApp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
    }

    // CHECKOUT (CREATE ORDER)
// ALSO THE ORDER SUM IS CALCULATED HERE
    public Cart checkout(CheckoutRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = new Cart();
        cart.setUserId(user.getId());
        cart.setRestaurantId(request.getRestaurantId());

        List<CartItem> cartItems = request.getItems().stream().map(item -> {
            CartItem cartItem = new CartItem();
            cartItem.setFoodName(item.getFoodName());
            cartItem.setQuantity(item.getQuantity());
            cartItem.setPrice(item.getPrice());
            return cartItem;
        }).collect(Collectors.toList());

        double total = cartItems.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();

        cart.setItems(cartItems);
        cart.setTotalPrice(total);
        cart.setStatus(OrderStatus.PLACED);

        return cartRepository.save(cart);
    }

    // USER: VIEW OWN ORDERS
    public List<Cart> getUserOrders(String userId) {
        return cartRepository.findByUserId(userId);
    }

    // ADMIN: VIEW ALL ORDERS
    public List<Cart> getAllOrders(String adminId) {

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Admin access only");
        }

        return cartRepository.findAll();
    }

    // ADMIN: UPDATE ORDER STATUS
    public Cart updateOrderStatus(String adminId, String orderId,
                                  UpdateOrderStatusRequest request) {

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Admin access only");
        }

        Cart cart = cartRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        cart.setStatus(request.getStatus());

        return cartRepository.save(cart);
    }
}

