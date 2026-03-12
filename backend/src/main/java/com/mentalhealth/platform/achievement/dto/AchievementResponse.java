package com.mentalhealth.platform.achievement.dto;

import java.time.LocalDateTime;

public class AchievementResponse {

    private String id;
    private boolean earned;
    private LocalDateTime earnedAt;

    public AchievementResponse(String id, boolean earned, LocalDateTime earnedAt) {
        this.id = id;
        this.earned = earned;
        this.earnedAt = earnedAt;
    }

    public String getId() { return id; }
    public boolean isEarned() { return earned; }
    public LocalDateTime getEarnedAt() { return earnedAt; }
}