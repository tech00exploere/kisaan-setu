package com.supermandi.cart;

import java.time.LocalDateTime;
import java.util.List;

public record CartResponse(
    String id,
    String userId,
    List<CartItem> items,
    Double totalAmount,
    LocalDateTime updatedAt
) {
    public static CartResponse fromEntity(Cart cart) {
        Double totalAmount = cart.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        return new CartResponse(
                cart.getId(),
                cart.getUserId(),
                cart.getItems(),
                totalAmount,
                cart.getUpdatedAt()
        );
    }
}
