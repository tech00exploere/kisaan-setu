package com.supermandi.company;

public record CompanyProfileRequest(
        String companyName,
        String gstNumber,
        String businessType,
        String address
) {}
