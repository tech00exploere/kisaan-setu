package com.supermandi.farmer;

import com.supermandi.product.ProductRequest;
import com.supermandi.product.ProductResponse;
import com.supermandi.product.ProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmer")
@RequiredArgsConstructor
@Tag(name = "Farmer")
@PreAuthorize("hasRole('FARMER')")
public class FarmerController {

    private final FarmerService farmerService;
    private final ProductService productService;

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/profile")
    public ResponseEntity<FarmerProfile> getProfile() {
        return ResponseEntity.ok(farmerService.getProfile(getCurrentUserId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<FarmerProfile> updateProfile(@Valid @RequestBody FarmerProfileRequest req) {
        return ResponseEntity.ok(farmerService.upsertProfile(getCurrentUserId(), req));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<FarmerDashboardResponse> getDashboard() {
        return ResponseEntity.ok(farmerService.getDashboard(getCurrentUserId()));
    }

    @GetMapping("/me/products")
    public ResponseEntity<List<ProductResponse>> getMyProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String startsWith) {

        List<ProductResponse> allProducts = productService.getProductsBySeller(getCurrentUserId());

        if (category != null && !category.isBlank()) {
            allProducts = allProducts.stream()
                    .filter(p -> category.equalsIgnoreCase(p.category()))
                    .toList();
        } else if (startsWith != null && !startsWith.isBlank()) {
            allProducts = allProducts.stream()
                    .filter(p -> p.name() != null && p.name().toLowerCase().startsWith(startsWith.toLowerCase()))
                    .toList();
        }

        return ResponseEntity.ok(allProducts);
    }

    @PostMapping("/me/products")
    public ResponseEntity<ProductResponse> addProduct(@Valid @RequestBody ProductRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(getCurrentUserId(), req));
    }
}
