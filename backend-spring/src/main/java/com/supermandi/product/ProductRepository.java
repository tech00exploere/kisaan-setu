package com.supermandi.product;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategoryIgnoreCase(String category);
    List<Product> findBySellerId(String sellerId);
    List<Product> findBySellerIdAndCategoryContainingIgnoreCase(String sellerId, String category);
    List<Product> findBySellerIdAndNameStartingWithIgnoreCase(String sellerId, String prefix);

    @Query("{'$or': [{'name': {'$regex': ?0, '$options': 'i'}}, {'description': {'$regex': ?0, '$options': 'i'}}]}")
    List<Product> searchProducts(String query);
}
