package com.supermandi.company;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
@Tag(name = "Company")
@PreAuthorize("hasRole('COMPANY')")
public class CompanyController {
    private final CompanyService companyService;

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/profile")
    public ResponseEntity<CompanyProfile> getProfile() {
        return ResponseEntity.ok(companyService.getProfile(getCurrentUserId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<CompanyProfile> updateProfile(@Valid @RequestBody CompanyProfileRequest req) {
        return ResponseEntity.ok(companyService.upsertProfile(getCurrentUserId(), req));
    }
}
