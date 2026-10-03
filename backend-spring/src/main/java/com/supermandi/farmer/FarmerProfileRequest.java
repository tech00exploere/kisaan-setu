package com.supermandi.farmer;

import java.util.List;

public record FarmerProfileRequest(
        String farmName,
        String location,
        Double farmSize,
        Boolean aadharVerified,
        List<String> crops
) {}
