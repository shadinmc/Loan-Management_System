package com.lms.common.idempotency;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Optional;

@Component
@Order(2) // after JWT filter
public class IdempotencyFilter extends OncePerRequestFilter {

    private final IdempotencyKeyService idempotencyService;

    public IdempotencyFilter(IdempotencyKeyService idempotencyService) {
        this.idempotencyService = idempotencyService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Only apply to POST requests on /api/loans/apply
        return !"POST".equalsIgnoreCase(request.getMethod())
                || !request.getServletPath().equals("/api/loans/apply");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String idempotencyKey = request.getHeader("X-Idempotency-Key");

        // If no idempotency key, continue (let controller handle it)
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        // Check if this key was used before
        Optional<IdempotencyRecord> existing = idempotencyService.findByKey(idempotencyKey);

        if (existing.isPresent()) {
            IdempotencyRecord record = existing.get();

            // Check if expired
            if (record.getExpiresAt().isBefore(java.time.Instant.now())) {
                // Expired - allow new request
                filterChain.doFilter(request, response);
                return;
            }

            // Return cached response - duplicate request detected!
            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setHeader("X-Idempotency-Replay", "true");

            // Build JSON manually (simple approach - no ObjectMapper needed)
            String jsonResponse = String.format(
                    "{\"loanId\":\"%s\",\"message\":\"Loan application already submitted with this idempotency key\",\"isDuplicate\":true}",
                    record.getResourceId()
            );

            PrintWriter writer = response.getWriter();
            writer.write(jsonResponse);
            writer.flush();
            return;
        }

        // New request - continue processing
        filterChain.doFilter(request, response);
    }
}