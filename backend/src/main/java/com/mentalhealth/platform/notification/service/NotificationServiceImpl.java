package com.mentalhealth.platform.notification.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentalhealth.platform.common.exception.ResourceNotFoundException;
import com.mentalhealth.platform.notification.dto.NotificationResponse;
import com.mentalhealth.platform.notification.entity.Notification;
import com.mentalhealth.platform.notification.entity.NotificationType;
import com.mentalhealth.platform.notification.repository.NotificationRepository;
import com.mentalhealth.platform.user.entity.User;
import com.mentalhealth.platform.user.repository.UserRepository;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository,
                                   UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<NotificationResponse> getUserNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Notification> notifications =
                notificationRepository.findByUserOrderByCreatedAtDesc(user);

        return notifications.stream()
                .map(n -> new NotificationResponse(
                        n.getId(),
                        n.getTitle(),
                        n.getMessage(),
                        n.getType(),
                        n.isRead(),
                        n.getCreatedAt()
                ))
                .toList();
    }

    @Override
    @Transactional
    public void markAllAsRead(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        notificationRepository.markAllAsReadByUser(user);
    }

    @Override
    @Transactional
    public void markAsReadByType(String email, NotificationType type) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        notificationRepository.markAsReadByUserAndType(user, type);
    }
}