package com.example.FoodApp.config;

import com.example.FoodApp.enums.FoodCategory;
import com.example.FoodApp.enums.Role;
import com.example.FoodApp.model.FoodItem;
import com.example.FoodApp.model.Restaurant;
import com.example.FoodApp.model.User;
import com.example.FoodApp.repository.RestaurantRepository;
import com.example.FoodApp.repository.UserRepository;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
            UserRepository userRepository,
            RestaurantRepository restaurantRepository,
            MongoClient mongoClient // ✅ injected by Spring
    ) {

        return args -> {

            /* ============================
               🔍 MONGODB ATLAS PING TEST
               ============================ */
            try {
                MongoDatabase database = mongoClient.getDatabase("admin");
                database.runCommand(new Document("ping", 1));
                System.out.println("✅ Successfully connected to MongoDB Atlas!");
            } catch (Exception e) {
                System.err.println("❌ MongoDB connection failed");
                e.printStackTrace();
                return; // ❌ Stop seeding if DB is not connected
            }

            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            /* ============================
               👤 ADMIN SEED
               ============================ */
            if (userRepository.findByEmail("admin@foodapp.com").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@foodapp.com");
                admin.setPassword(encoder.encode("admin123"));
                admin.setName("Main Admin");
                admin.setPhoneNumber("9999999999");
                admin.setAddress("Admin HQ");
                admin.setRole(Role.ADMIN);

                userRepository.save(admin);
            }

            /* ============================
               👤 USER SEED
               ============================ */
            if (userRepository.findByEmail("user@foodapp.com").isEmpty()) {
                User user = new User();
                user.setEmail("user@foodapp.com");
                user.setPassword(encoder.encode("user123"));
                user.setName("Normal User");
                user.setPhoneNumber("8888888888");
                user.setAddress("User Home");
                user.setRole(Role.CUSTOMER);

                userRepository.save(user);
            }

            /* ============================
               🍽 RESTAURANT + FOOD ITEMS
               ============================ */
            if (restaurantRepository.count() == 0) {

                Restaurant restaurant = new Restaurant();
                restaurant.setName("Food Hub");
                restaurant.setDescription("Best food in town");

                List<FoodItem> foodItems = new ArrayList<>();

                FoodItem f1 = new FoodItem();
                f1.setName("Burger");
                f1.setPrice(120);
                f1.setCategory(FoodCategory.STARTERS);

                FoodItem f2 = new FoodItem();
                f2.setName("Chicken Biryani");
                f2.setPrice(250);
                f2.setCategory(FoodCategory.MAIN_COURSE);

                FoodItem f3 = new FoodItem();
                f3.setName("Coke");
                f3.setPrice(40);
                f3.setCategory(FoodCategory.BEVERAGES);

                foodItems.add(f1);
                foodItems.add(f2);
                foodItems.add(f3);

                restaurant.setFoodItems(foodItems);
                restaurantRepository.save(restaurant);
            }

            System.out.println("✅ Database Seeded Successfully");
        };
    }
}
