package com.supermandi.company;
public interface CompanyService {

    CompanyProfile getProfile(String userId);

    CompanyProfile upsertProfile(String userId, CompanyProfileRequest req);
}
