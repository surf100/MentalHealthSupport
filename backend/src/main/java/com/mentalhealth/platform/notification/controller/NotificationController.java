package com.mentalhealth.platform.notification.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mentalhealth.platform.notification.dto.NotificationResponse;
import com.mentalhealth.platform.notification.entity.NotificationType;
import com.mentalhealth.platform.notification.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationResponse> getNotifications(Authentication authentication) {
        return notificationService.getUserNotifications(authentication.getName());
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        notificationService.markAllAsRead(authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/read-by-type")
    public ResponseEntity<Void> markAsReadByType(
            @RequestParam NotificationType type,
            Authentication authentication) {
        notificationService.markAsReadByType(authentication.getName(), type);
        return ResponseEntity.noContent().build();
    }
}