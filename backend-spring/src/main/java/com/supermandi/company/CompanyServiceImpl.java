package com.supermandi.company;

import com.supermandi.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Concrete implementation of CompanyService.
 */
@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyProfileRepository companyProfileRepository;

    @Override
    public CompanyProfile getProfile(String userId) {
        return companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found for user: " + userId));
    }

    @Override
    public CompanyProfile upsertProfile(String userId, CompanyProfileRequest req) {
        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElse(CompanyProfile.builder().userId(userId).build());

        if (req.companyName() != null) profile.setCompanyName(req.companyName());
        if (req.gstNumber() != null) profile.setGstNumber(req.gstNumber());
        if (req.businessType() != null) profile.setBusinessType(req.businessType());
        if (req.address() != null) profile.setAddress(req.address());

        return companyProfileRepository.save(profile);
    }
}
