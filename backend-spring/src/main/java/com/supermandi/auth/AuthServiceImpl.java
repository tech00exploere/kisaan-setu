package com.supermandi.auth;

import com.supermandi.common.exception.BadRequestException;
import com.supermandi.common.exception.DuplicateResourceException;
import com.supermandi.user.User;
import com.supermandi.user.UserRepository;
import com.supermandi.user.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Concrete implementation of AuthService.
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new DuplicateResourceException("Email already exists");
        }

        User user = User.builder()
                .name(req.name())
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .phone(req.phone())
                .role(req.role())
                .isVerified(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        user = userRepository.save(user);

        String token = jwtService.generateToken(user);
        String refreshTokenString = jwtService.generateRefreshToken(user);

        RefreshToken refreshToken = RefreshToken.builder()
                .userId(user.getId())
                .token(refreshTokenString)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusSeconds(3600 * 24 * 7))
                .build();
        refreshTokenRepository.save(refreshToken);

        return new AuthResponse(token, UserResponse.fromEntity(user));
    }

    @Override
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);
        String refreshTokenString = jwtService.generateRefreshToken(user);

        refreshTokenRepository.deleteByUserId(user.getId());

        RefreshToken refreshToken = RefreshToken.builder()
                .userId(user.getId())
                .token(refreshTokenString)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusSeconds(3600 * 24 * 7))
                .build();
        refreshTokenRepository.save(refreshToken);

        return new AuthResponse(token, UserResponse.fromEntity(user));
    }

    @Override
    public AuthResponse refresh(RefreshTokenRequest req) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(req.refreshToken())
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new BadRequestException("Refresh token expired");
        }

        User user = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String token = jwtService.generateToken(user);

        return new AuthResponse(token, UserResponse.fromEntity(user));
    }

    @Override
    public void logout(String userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }
}
