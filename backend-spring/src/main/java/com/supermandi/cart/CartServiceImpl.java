package com.supermandi.cart;

import com.supermandi.common.exception.ResourceNotFoundException;
import com.supermandi.product.Product;
import com.supermandi.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Concrete implementation of CartService.
 */
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    @Override
    public CartResponse getCart(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> Cart.builder().userId(userId).build());
        return CartResponse.fromEntity(cart);
    }

    @Override
    public CartResponse addToCart(String userId, AddToCartRequest req) {
        Product product = productRepository.findById(req.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> Cart.builder().userId(userId).build());

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(req.productId()))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + req.quantity());
        } else {
            CartItem newItem = CartItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .price(product.getPrice())
                    .quantity(req.quantity())
                    .build();
            cart.getItems().add(newItem);
        }

        cartRepository.save(cart);
        return CartResponse.fromEntity(cart);
    }

    @Override
    public CartResponse updateCartItem(String userId, String productId, Integer quantity) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item not in cart"));

        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            item.setQuantity(quantity);
        }

        cartRepository.save(cart);
        return CartResponse.fromEntity(cart);
    }

    @Override
    public void removeFromCart(String userId, String productId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        cartRepository.save(cart);
    }

    @Override
    public void clearCart(String userId) {
        cartRepository.deleteByUserId(userId);
    }
}
