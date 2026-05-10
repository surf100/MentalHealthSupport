package com.mentalhealth.platform.notification.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mentalhealth.platform.notification.entity.NotificationType;

public class NotificationResponse {

    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private boolean isRead;
    private LocalDateTime createdAt;

    public NotificationResponse() {}

    public NotificationResponse(Long id, String title, String message,
                                NotificationType type, boolean isRead,
                                LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.type = type;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }

    public String getTitle() { return title; }

    public String getMessage() { return message; }

    public NotificationType getType() { return type; }

    @JsonProperty("isRead")
    public boolean isRead() { return isRead; }

    public LocalDateTime getCreatedAt() { return createdAt; }

}