package com.mentalhealth.platform.auth.service;

import com.mentalhealth.platform.auth.dto.AccountSettingsResponse;
import com.mentalhealth.platform.auth.dto.AuthResponse;
import com.mentalhealth.platform.auth.dto.CurrentUserResponse;
import com.mentalhealth.platform.auth.dto.SignInRequest;
import com.mentalhealth.platform.auth.dto.SignUpRequest;
import com.mentalhealth.platform.auth.dto.UpdateAccountRequest;
import com.mentalhealth.platform.common.exception.InvalidCredentialsException;
import com.mentalhealth.platform.common.exception.ResourceConflictException;
import com.mentalhealth.platform.common.exception.ResourceNotFoundException;
import com.mentalhealth.platform.common.exception.UserBlockedException;
import com.mentalhealth.platform.profile.entity.Profile;
import com.mentalhealth.platform.profile.repository.ProfileRepository;
import com.mentalhealth.platform.security.JwtService;
import com.mentalhealth.platform.user.entity.User;
import com.mentalhealth.platform.user.enums.UserRole;
import com.mentalhealth.platform.user.enums.UserStatus;
import com.mentalhealth.platform.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final ProfileRepository profileRepository;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            ProfileRepository profileRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.profileRepository = profileRepository;
    }

    public AuthResponse signUp(SignUpRequest request) {
        String email = normalizeEmail(request.getEmail());
        String nickname = normalizeNickname(request.getNickname());
        String password = request.getPassword() != null ? request.getPassword().trim() : "";

        if (userRepository.existsByEmail(email)) {
            throw new ResourceConflictException("Email already exists");
        }

        if (userRepository.existsByNickname(nickname)) {
            throw new ResourceConflictException("Nickname already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setNickname(nickname);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(UserRole.USER);
        user.setStatus(UserStatus.ACTIVE);

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getNickname(),
                user.getRole().name()
        );
    }

    public AuthResponse signIn(SignInRequest request) {
        String email = normalizeEmail(request.getEmail());
        String password = request.getPassword() != null ? request.getPassword().trim() : "";

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (user.getStatus() == UserStatus.BANNED) {
            throw new UserBlockedException("Your account has been banned");
        }

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new UserBlockedException("Your account is suspended");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
        } catch (BadCredentialsException ex) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getNickname(),
                user.getRole().name()
        );
    }

    public CurrentUserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        return new CurrentUserResponse(
                user.getEmail(),
                user.getNickname(),
                user.getRole().name()
        );
    }

    public AccountSettingsResponse updateAccount(String email, UpdateAccountRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // ── Change nickname ──────────────────────────────────────────────────
        if (request.getNickname() != null && !request.getNickname().isBlank()) {
            String newNickname = request.getNickname().trim();
            if (!newNickname.equals(user.getNickname())) {
                if (userRepository.existsByNickname(newNickname)) {
                    throw new ResourceConflictException("Nickname already taken");
                }
                user.setNickname(newNickname);
            }
        }

        // ── Change email ─────────────────────────────────────────────────────
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            String newEmail = request.getEmail().trim().toLowerCase();
            if (!newEmail.equals(user.getEmail())) {
                if (userRepository.existsByEmail(newEmail)) {
                    throw new ResourceConflictException("Email already in use");
                }
                user.setEmail(newEmail);
            }
        }

        // ── Change password ──────────────────────────────────────────────────
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new IllegalArgumentException("Current password is required");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
                throw new IllegalArgumentException("Current password is incorrect");
            }
            if (request.getNewPassword().length() < 6) {
                throw new IllegalArgumentException("New password must be at least 6 characters");
            }
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        }

        userRepository.save(user);

        Profile profile = profileRepository.findByUser(user)
                .orElseGet(() -> {
                    Profile p = new Profile();
                    p.setUser(user);
                    p.setDisplayName(user.getNickname());
                    return profileRepository.save(p);
                });

        return new AccountSettingsResponse(
                user.getEmail(),
                user.getNickname(),
                profile.getNotificationsEnabled(),
                profile.getPrivacyModeEnabled(),
                profile.getThemePreference(),
                profile.getLanguagePreference(),
                jwtService.generateToken(user.getEmail())
        );
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private String normalizeNickname(String nickname) {
        return nickname == null ? "" : nickname.trim();
    }
}