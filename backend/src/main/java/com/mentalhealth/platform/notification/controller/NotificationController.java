package com.mentalhealth.platform.notification.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mentalhealth.platform.notification.dto.NotificationResponse;
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

        String email = authentication.getName();
        System.out.println("GET /api/notifications auth name = " + authentication.getName());
        return notificationService.getUserNotifications(email);
    }
        
    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        String email = authentication.getName();
        notificationService.markAllAsRead(email);
        System.out.println("PATCH /api/notifications/read-all auth name = " + authentication.getName());
        return ResponseEntity.noContent().build();
    }

}