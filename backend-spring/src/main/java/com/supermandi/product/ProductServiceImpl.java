package com.supermandi.product;

import com.supermandi.common.exception.BadRequestException;
import com.supermandi.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Concrete implementation of ProductService.
 */
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse getProductById(String id) {
        return productRepository.findById(id)
                .map(productMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Override
    public ProductResponse createProduct(String sellerId, ProductRequest req) {
        Product product = productMapper.toEntity(req, sellerId);
        Product saved = productRepository.save(product);
        return productMapper.toResponse(saved);
    }

    @Override
    public ProductResponse updateProduct(String id, String sellerId, ProductRequest req) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (!product.getSellerId().equals(sellerId)) {
            throw new BadRequestException("You can only update your own products");
        }

        productMapper.updateEntityFromRequest(product, req);
        Product saved = productRepository.save(product);
        return productMapper.toResponse(saved);
    }

    @Override
    public void deleteProduct(String id, String sellerId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (!product.getSellerId().equals(sellerId)) {
            throw new BadRequestException("You can only delete your own products");
        }

        productRepository.delete(product);
    }

    @Override
    public List<ProductResponse> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category).stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> searchProducts(String query) {
        return productRepository.searchProducts(query).stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getProductsBySeller(String sellerId) {
        return productRepository.findBySellerId(sellerId).stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getSellerProductsByCategory(String sellerId, String category) {
        return productRepository.findBySellerIdAndCategoryContainingIgnoreCase(sellerId, category).stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }
}
