package com.supermandi.product;

import java.util.List;

/**
 * Product Business Service Interface (DIP / ISP).
 */
public interface ProductService {

    List<ProductResponse> getAllProducts();

    ProductResponse getProductById(String id);

    ProductResponse createProduct(String sellerId, ProductRequest req);

    ProductResponse updateProduct(String id, String sellerId, ProductRequest req);

    void deleteProduct(String id, String sellerId);

    List<ProductResponse> getProductsByCategory(String category);

    List<ProductResponse> searchProducts(String query);

    List<ProductResponse> getProductsBySeller(String sellerId);

    List<ProductResponse> getSellerProductsByCategory(String sellerId, String category);
}
