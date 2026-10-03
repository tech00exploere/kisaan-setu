package com.supermandi.auth;

/**
 * Authentication Service Interface (DIP / ISP).
 */
public interface AuthService {

    AuthResponse register(RegisterRequest req);

    AuthResponse login(LoginRequest req);

    AuthResponse refresh(RefreshTokenRequest req);

    void logout(String userId);
}
