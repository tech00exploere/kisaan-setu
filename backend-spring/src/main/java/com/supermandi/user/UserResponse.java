package com.supermandi.user;

import java.time.LocalDateTime;

public record UserResponse(
        String id,
        String name,
        String email,
        String phone,
        String role,
        boolean isVerified,
        LocalDateTime createdAt
) {
    public static UserResponse fromEntity(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole() != null ? user.getRole().name().toLowerCase() : null,
                user.isVerified(),
                user.getCreatedAt()
        );
    }
}
