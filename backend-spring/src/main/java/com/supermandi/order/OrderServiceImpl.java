package com.supermandi.order;

import com.supermandi.cart.Cart;
import com.supermandi.cart.CartRepository;
import com.supermandi.common.exception.BadRequestException;
import com.supermandi.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Concrete implementation of OrderService.
 */
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;

    @Override
    @Transactional
    public OrderResponse placeOrder(String userId, OrderRequest req) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        List<OrderItem> orderItems = cart.getItems().stream()
                .map(cartItem -> OrderItem.builder()
                        .productId(cartItem.getProductId())
                        .productName(cartItem.getProductName())
                        .price(cartItem.getPrice())
                        .quantity(cartItem.getQuantity())
                        .build())
                .collect(Collectors.toList());

        Double totalAmount = orderItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        Order order = Order.builder()
                .userId(userId)
                .items(orderItems)
                .totalAmount(totalAmount)
                .status(OrderStatus.PENDING)
                .paymentMode(req.paymentMode())
                .fullName(req.fullName())
                .address(req.address())
                .city(req.city())
                .state(req.state())
                .pincode(req.pincode())
                .build();

        orderRepository.save(order);
        cartRepository.deleteByUserId(userId);

        return OrderResponse.fromEntity(order);
    }

    @Override
    public List<OrderResponse> getMyOrders(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse getOrderById(String id, String userId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUserId().equals(userId)) {
            throw new BadRequestException("Order does not belong to user");
        }

        return OrderResponse.fromEntity(order);
    }

    @Override
    public OrderResponse updateOrderStatus(String id, String newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        try {
            order.setStatus(OrderStatus.valueOf(newStatus.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status");
        }

        orderRepository.save(order);
        return OrderResponse.fromEntity(order);
    }
}
