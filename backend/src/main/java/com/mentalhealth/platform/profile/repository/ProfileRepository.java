package com.mentalhealth.platform.profile.repository;

import com.mentalhealth.platform.profile.entity.Profile;
import com.mentalhealth.platform.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByUser(User user);
    Optional<Profile> findByUserEmail(String email); // добавляем для удобства поиска по email
}