package com.supermandi.category;

import com.supermandi.common.exception.DuplicateResourceException;
import com.supermandi.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Concrete implementation of CategoryService.
 */
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse createCategory(Category category) {
        if (categoryRepository.existsByNameIgnoreCase(category.getName())) {
            throw new DuplicateResourceException("Category already exists with name: " + category.getName());
        }

        String slug = category.getName().toLowerCase().replaceAll("\\s+", "-");
        category.setSlug(slug);

        Category saved = categoryRepository.save(category);
        return CategoryResponse.fromEntity(saved);
    }

    @Override
    public CategoryResponse updateCategory(String id, Category category) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        existing.setName(category.getName());
        existing.setSlug(category.getName().toLowerCase().replaceAll("\\s+", "-"));
        existing.setDescription(category.getDescription());
        existing.setIconUrl(category.getIconUrl());

        Category saved = categoryRepository.save(existing);
        return CategoryResponse.fromEntity(saved);
    }

    @Override
    public void deleteCategory(String id) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        categoryRepository.delete(existing);
    }
}
