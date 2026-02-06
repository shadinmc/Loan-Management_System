package com.lms.common.idempotency;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Order(2) // ✅ AFTER JWT filter
public class IdempotencyFilter extends OncePerRequestFilter {

    private final IdempotencyKeyService service;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        return path.startsWith("/api/auth/")
                || "GET".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String key = request.getHeader("X-Idempotency-Key");

        if (key == null || key.isBlank()) {
            response.sendError(
                    HttpStatus.BAD_REQUEST.value(),
                    "Missing X-Idempotency-Key header"
            );
            return;
        }

        if (service.existsByKey(key)) {
            response.sendError(
                    HttpStatus.CONFLICT.value(),
                    "Duplicate request (Idempotency-Key already used)"
            );
            return;
        }

        filterChain.doFilter(request, response);
    }
}
