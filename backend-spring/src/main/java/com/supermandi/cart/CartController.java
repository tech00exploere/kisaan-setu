package com.supermandi.cart;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Cart")
public class CartController {
    private final CartService cartService;

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart() {
        return ResponseEntity.ok(cartService.getCart(getCurrentUserId()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(@Valid @RequestBody AddToCartRequest req) {
        return ResponseEntity.ok(cartService.addToCart(getCurrentUserId(), req));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<CartResponse> updateItem(@PathVariable String productId, @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateCartItem(getCurrentUserId(), productId, quantity));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Void> removeItem(@PathVariable String productId) {
        cartService.removeFromCart(getCurrentUserId(), productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart(getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
