package com.supermandi.farmer;

import com.supermandi.common.exception.ResourceNotFoundException;
import com.supermandi.order.Order;
import com.supermandi.order.OrderItem;
import com.supermandi.order.OrderRepository;
import com.supermandi.product.Product;
import com.supermandi.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Concrete implementation of FarmerService.
 */
@Service
@RequiredArgsConstructor
public class FarmerServiceImpl implements FarmerService {

    private final FarmerProfileRepository farmerProfileRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Override
    public FarmerProfile getProfile(String userId) {
        return farmerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer profile not found for user: " + userId));
    }

    @Override
    public FarmerProfile upsertProfile(String userId, FarmerProfileRequest req) {
        FarmerProfile profile = farmerProfileRepository.findByUserId(userId)
                .orElse(FarmerProfile.builder().userId(userId).build());

        if (req.farmName() != null) profile.setFarmName(req.farmName());
        if (req.location() != null) profile.setLocation(req.location());
        if (req.farmSize() != null) profile.setFarmSize(req.farmSize());
        if (req.aadharVerified() != null) profile.setAadharVerified(req.aadharVerified());
        if (req.crops() != null) profile.setCrops(req.crops());

        return farmerProfileRepository.save(profile);
    }

    @Override
    public FarmerDashboardResponse getDashboard(String userId) {
        List<Product> products = productRepository.findBySellerId(userId);
        Set<String> productIds = products.stream().map(Product::getId).collect(Collectors.toSet());
        Map<String, Product> productMap = products.stream().collect(Collectors.toMap(Product::getId, p -> p));

        List<Order> allOrders = orderRepository.findAll();

        long totalProducts = products.size();
        long totalOrders = 0;
        double totalRevenue = 0.0;
        long completedOrders = 0;
        long pendingOrders = 0;

        Map<String, Double> categoryRevenue = new HashMap<>();
        Map<String, Long> productQuantityMap = new HashMap<>();

        for (Order order : allOrders) {
            boolean hasSellerProduct = false;
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    if (productIds.contains(item.getProductId())) {
                        hasSellerProduct = true;

                        Product p = productMap.get(item.getProductId());
                        if (p != null) {
                            if ("COMPLETED".equalsIgnoreCase(order.getStatus().name()) || "SHIPPED".equalsIgnoreCase(order.getStatus().name())) {
                                double revenue = item.getPrice() * item.getQuantity();
                                totalRevenue += revenue;
                                categoryRevenue.merge(p.getCategory(), revenue, Double::sum);
                            }
                            productQuantityMap.merge(p.getName(), (long) item.getQuantity(), Long::sum);
                        }
                    }
                }
            }
            if (hasSellerProduct) {
                totalOrders++;
                if ("COMPLETED".equalsIgnoreCase(order.getStatus().name()) || "SHIPPED".equalsIgnoreCase(order.getStatus().name())) {
                    completedOrders++;
                } else {
                    pendingOrders++;
                }
            }
        }

        List<Map<String, Object>> revenueByCategory = categoryRevenue.entrySet().stream()
                .map(e -> Map.of("category", (Object) e.getKey(), "revenue", e.getValue()))
                .collect(Collectors.toList());

        List<Map<String, Object>> topProducts = productQuantityMap.entrySet().stream()
                .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
                .limit(5)
                .map(e -> Map.of("productName", (Object) e.getKey(), "quantitySold", e.getValue()))
                .collect(Collectors.toList());

        return new FarmerDashboardResponse(
                totalProducts,
                totalOrders,
                totalRevenue,
                completedOrders,
                pendingOrders,
                revenueByCategory,
                topProducts
        );
    }
}
