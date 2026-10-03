package com.supermandi.farmer;

/**
 * Farmer Service Interface (DIP / ISP).
 */
public interface FarmerService {

    FarmerProfile getProfile(String userId);

    FarmerProfile upsertProfile(String userId, FarmerProfileRequest req);

    FarmerDashboardResponse getDashboard(String userId);
}
