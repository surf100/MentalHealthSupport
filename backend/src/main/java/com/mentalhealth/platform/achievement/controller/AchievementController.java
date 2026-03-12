package com.mentalhealth.platform.achievement.controller;

import com.mentalhealth.platform.achievement.dto.AchievementResponse;
import com.mentalhealth.platform.achievement.service.AchievementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    // GET /api/achievements
    @GetMapping
    public ResponseEntity<List<AchievementResponse>> getAchievements(Authentication authentication) {
        return ResponseEntity.ok(achievementService.getAchievements(authentication.getName()));
    }
}