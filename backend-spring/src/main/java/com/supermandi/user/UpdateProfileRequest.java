package com.supermandi.user;

public record UpdateProfileRequest(
        String name,
        String phone
) {
}
