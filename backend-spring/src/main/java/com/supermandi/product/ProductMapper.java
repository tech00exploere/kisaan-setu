package com.supermandi.product;

import org.springframework.stereotype.Component;

/**
 * Mapper component for Product domain mappings (SRP).
 */
@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {
        if (product == null) {
            return null;
        }
        return ProductResponse.fromEntity(product);
    }

    public Product toEntity(ProductRequest req, String sellerId) {
        return Product.builder()
                .name(req.name())
                .description(req.description())
                .price(req.price())
                .category(req.category())
                .imageUrl(req.imageUrl())
                .unit(req.unit())
                .quantity(req.quantity())
                .location(req.location())
                .farmerName(req.farmerName())
                .forecast(req.forecast())
                .sellerId(sellerId)
                .build();
    }

    public void updateEntityFromRequest(Product product, ProductRequest req) {
        product.setName(req.name());
        product.setDescription(req.description());
        product.setPrice(req.price());
        product.setCategory(req.category());
        product.setImageUrl(req.imageUrl());
        product.setUnit(req.unit());
        product.setQuantity(req.quantity());
        product.setLocation(req.location());
        product.setFarmerName(req.farmerName());
        product.setForecast(req.forecast());
    }
}
