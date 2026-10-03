package com.supermandi.user;

/**
 * User Service Interface (DIP / ISP).
 */
public interface UserService {

    User findById(String id);

    User findByEmail(String email);

    UserResponse getProfile(String userId);

    UserResponse updateProfile(String userId, UpdateProfileRequest req);
}
