package com.supermandi.company;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "company_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyProfile {
    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private String companyName;
    private String gstNumber;
    private String businessType;
    private String address;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
