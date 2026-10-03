package com.supermandi.farmer;

import java.util.List;
import java.util.Map;

public record FarmerDashboardResponse(
        long totalProducts,
        long totalOrders,
        double totalRevenue,
        long completedOrders,
        long pendingOrders,
        List<Map<String, Object>> revenueByCategory,
        List<Map<String, Object>> topProducts
) {}
