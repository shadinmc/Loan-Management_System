package com.example.FoodApp.repository;

import com.example.FoodApp.model.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface
CartRepository extends MongoRepository<Cart, String> {
    List<Cart> findByUserId(String userId);
}

