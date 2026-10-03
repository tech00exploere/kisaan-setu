package com.supermandi.user;

import com.supermandi.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Concrete implementation of UserService.
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User findById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Override
    public UserResponse getProfile(String userId) {
        User user = findById(userId);
        return UserResponse.fromEntity(user);
    }

    @Override
    public UserResponse updateProfile(String userId, UpdateProfileRequest req) {
        User user = findById(userId);
        if (req.name() != null) {
            user.setName(req.name());
        }
        if (req.phone() != null) {
            user.setPhone(req.phone());
        }
        user = userRepository.save(user);
        return UserResponse.fromEntity(user);
    }
}
