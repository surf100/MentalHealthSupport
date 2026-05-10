package com.mentalhealth.platform.notification.service;

import java.util.List;

import com.mentalhealth.platform.notification.dto.NotificationResponse;
import com.mentalhealth.platform.notification.entity.NotificationType;

public interface NotificationService {

    List<NotificationResponse> getUserNotifications(String email);
    void markAllAsRead(String email);
    void markAsReadByType(String email, NotificationType type);
}