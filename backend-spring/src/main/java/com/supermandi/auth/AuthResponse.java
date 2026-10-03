package com.supermandi.auth;

import com.supermandi.user.UserResponse;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
