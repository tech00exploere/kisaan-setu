package com.supermandi.product;

import java.time.LocalDateTime;

public record ProductResponse(
    String id,
    String name,
    String description,
    Double price,
    String category,
    String imageUrl,
    String unit,
    String quantity,
    String location,
    String farmerName,
    Integer forecast,
    String sellerId,
    LocalDateTime createdAt
) {
    public static ProductResponse fromEntity(Product product) {
        return new ProductResponse(
            product.getId(),
            product.getName(),
            product.getDescription(),
            product.getPrice(),
            product.getCategory(),
            product.getImageUrl(),
            product.getUnit(),
            product.getQuantity(),
            product.getLocation(),
            product.getFarmerName(),
            product.getForecast(),
            product.getSellerId(),
            product.getCreatedAt()
        );
    }
}
