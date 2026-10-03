package com.supermandi.cart;

/**
 * Cart Service Interface (DIP / ISP).
 */
public interface CartService {

    CartResponse getCart(String userId);

    CartResponse addToCart(String userId, AddToCartRequest req);

    CartResponse updateCartItem(String userId, String productId, Integer quantity);

    void removeFromCart(String userId, String productId);

    void clearCart(String userId);
}
