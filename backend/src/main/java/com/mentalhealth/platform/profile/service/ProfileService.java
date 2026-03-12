package com.mentalhealth.platform.profile.service;

import com.mentalhealth.platform.common.exception.ResourceNotFoundException;
import com.mentalhealth.platform.profile.dto.ProfileResponse;
import com.mentalhealth.platform.profile.dto.UpdateProfileRequest;
import com.mentalhealth.platform.profile.entity.Profile;
import com.mentalhealth.platform.profile.repository.ProfileRepository;
import com.mentalhealth.platform.user.entity.User;
import com.mentalhealth.platform.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public ProfileResponse getMyProfile(String email) {
        User user = getUserByEmail(email);
        Profile profile = getOrCreateProfile(user);

        return mapToResponse(user, profile);
    }

    public ProfileResponse updateMyProfile(String email, UpdateProfileRequest request) {
        User user = getUserByEmail(email);
        Profile profile = getOrCreateProfile(user);

        profile.setDisplayName(normalizeNullable(request.getDisplayName()));
        profile.setBio(normalizeNullable(request.getBio()));
        profile.setAvatarUrl(normalizeNullable(request.getAvatarUrl()));

        if (request.getPrivacyModeEnabled() != null) {
            profile.setPrivacyModeEnabled(request.getPrivacyModeEnabled());
        }

        if (request.getNotificationsEnabled() != null) {
            profile.setNotificationsEnabled(request.getNotificationsEnabled());
        }

        if (request.getThemePreference() != null) {
            profile.setThemePreference(request.getThemePreference().trim());
        }

        if (request.getLanguagePreference() != null) {
            profile.setLanguagePreference(request.getLanguagePreference().trim());
        }

        profileRepository.save(profile);

        return mapToResponse(user, profile);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Profile getOrCreateProfile(User user) {
        return profileRepository.findByUser(user)
                .orElseGet(() -> {
                    Profile profile = new Profile();
                    profile.setUser(user);
                    profile.setDisplayName(user.getNickname());
                    return profileRepository.save(profile);
                });
    }

    private ProfileResponse mapToResponse(User user, Profile profile) {
        return new ProfileResponse(
                user.getEmail(),
                user.getNickname(),
                profile.getDisplayName(),
                profile.getBio(),
                profile.getAvatarUrl(),
                profile.getPrivacyModeEnabled(),
                profile.getNotificationsEnabled(),
                profile.getThemePreference(),
                profile.getLanguagePreference(),
                user.getCreatedAt()
        );
    }

    private String normalizeNullable(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}