package com.supermandi.company;

/**
 * Company Service Interface (DIP / ISP).
 */
public interface CompanyService {

    CompanyProfile getProfile(String userId);

    CompanyProfile upsertProfile(String userId, CompanyProfileRequest req);
}
