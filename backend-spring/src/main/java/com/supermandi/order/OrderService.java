package com.supermandi.order;

import java.util.List;

/**
 * Order Service Interface (DIP / ISP).
 */
public interface OrderService {

    OrderResponse placeOrder(String userId, OrderRequest req);

    List<OrderResponse> getMyOrders(String userId);

    OrderResponse getOrderById(String id, String userId);

    OrderResponse updateOrderStatus(String id, String newStatus);
}
