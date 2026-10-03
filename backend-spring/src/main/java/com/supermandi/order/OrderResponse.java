package com.supermandi.order;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
    String id,
    String userId,
    List<OrderItem> items,
    Double totalAmount,
    String status,
    String paymentMode,
    String fullName,
    String address,
    String city,
    String state,
    String pincode,
    LocalDateTime createdAt
) {
    public static OrderResponse fromEntity(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getUserId(),
                order.getItems(),
                order.getTotalAmount(),
                order.getStatus().name(),
                order.getPaymentMode(),
                order.getFullName(),
                order.getAddress(),
                order.getCity(),
                order.getState(),
                order.getPincode(),
                order.getCreatedAt()
        );
    }
}
