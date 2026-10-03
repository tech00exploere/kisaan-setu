package com.supermandi.farmer;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "farmer_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmerProfile {
    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private String farmName;
    private String location;
    private Double farmSize;
    private boolean aadharVerified;

    @Builder.Default
    private List<String> crops = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
