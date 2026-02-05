package com.lms.common.idempotency;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class IdempotencyFilter extends OncePerRequestFilter {

    private final IdempotencyKeyService service;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Apply only for write operations
        if ("POST".equals(request.getMethod())
                || "PUT".equals(request.getMethod())) {

            String key = request.getHeader("Idempotency-Key");

            if (key == null || key.isBlank()) {
                response.sendError(
                        HttpStatus.BAD_REQUEST.value(),
                        "Missing Idempotency-Key header"
                );
                return;
            }

            if (service.exists(key)) {
                response.sendError(
                        HttpStatus.CONFLICT.value(),
                        "Duplicate request (Idempotency-Key already used)"
                );
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
