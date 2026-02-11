package com.lms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class LmsBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(LmsBackendApplication.class, args);
	}

}
