package com.supermandi.category;

public record CategoryResponse(
    String id,
    String name,
    String slug,
    String description,
    String iconUrl
) {
    public static CategoryResponse fromEntity(Category category) {
        return new CategoryResponse(
            category.getId(),
            category.getName(),
            category.getSlug(),
            category.getDescription(),
            category.getIconUrl()
        );
    }
}
