package com.lms.auth.service;

import com.lms.auth.security.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final JwtTokenProvider tokenProvider;

    public JwtService(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Claims extractAllClaims(String token) {
        return tokenProvider.extractClaims(token);
    }

    public boolean isTokenValid(String token) {
        return tokenProvider.validateToken(token);
    }
}
