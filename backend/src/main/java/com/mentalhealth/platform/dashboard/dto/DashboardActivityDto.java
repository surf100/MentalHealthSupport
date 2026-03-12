package com.mentalhealth.platform.dashboard.dto;

import java.time.LocalDateTime;

public class DashboardActivityDto {

    private String type;
    private String title;
    private String description;
    private String timestampLabel;
    private LocalDateTime createdAt;

    public DashboardActivityDto() {
    }

    public DashboardActivityDto(String type, String title, String description, String timestampLabel, LocalDateTime createdAt) {
        this.type = type;
        this.title = title;
        this.description = description;
        this.timestampLabel = timestampLabel;
        this.createdAt = createdAt;
    }

    public String getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getTimestampLabel() {
        return timestampLabel;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setTimestampLabel(String timestampLabel) {
        this.timestampLabel = timestampLabel;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}