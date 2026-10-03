package com.supermandi.category;

import java.util.List;

/**
 * Category Service Interface (DIP / ISP).
 */
public interface CategoryService {

    List<CategoryResponse> getAllCategories();

    CategoryResponse createCategory(Category category);

    CategoryResponse updateCategory(String id, Category category);

    void deleteCategory(String id);
}
