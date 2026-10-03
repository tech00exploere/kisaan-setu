package com.supermandi.company;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface CompanyProfileRepository extends MongoRepository<CompanyProfile, String> {
    Optional<CompanyProfile> findByUserId(String userId);
}
