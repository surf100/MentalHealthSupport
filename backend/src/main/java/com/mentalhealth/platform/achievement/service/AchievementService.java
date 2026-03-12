package com.mentalhealth.platform.achievement.service;

import java.util.List;

import com.mentalhealth.platform.achievement.dto.AchievementResponse;

public interface AchievementService {
    List<AchievementResponse> getAchievements(String email);
}