package com.supermandi.payment;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments")
public class PaymentController {
    private final PaymentService paymentService;

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getPaymentForOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(paymentService.getPaymentByOrderId(orderId));
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getMyPayments() {
        return ResponseEntity.ok(paymentService.getPaymentsByUserId(getCurrentUserId()));
    }
}
