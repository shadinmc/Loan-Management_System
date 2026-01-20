package com.example.FoodApp.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoDebugConfig {

    private final MongoTemplate mongoTemplate;
    private final MongoClient mongoClient;

    public MongoDebugConfig(MongoTemplate mongoTemplate, MongoClient mongoClient) {
        this.mongoTemplate = mongoTemplate;
        this.mongoClient = mongoClient;
    }

    @PostConstruct
    public void debugMongoConnection() {
        try {
            MongoDatabase db = mongoClient.getDatabase(mongoTemplate.getDb().getName());

            System.out.println("🍃 MongoDB DEBUG INFO");
            System.out.println("➡ Connected Database: " + db.getName());
            System.out.println("➡ Collections: " + db.listCollectionNames().into(new java.util.ArrayList<>()));
            System.out.println("✅ MongoDB Atlas connection SUCCESS");

        } catch (Exception e) {
            System.out.println("❌ MongoDB Atlas connection FAILED");
            e.printStackTrace();
        }
    }
}
