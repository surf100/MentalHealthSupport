package com.mentalhealth.platform.notification.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mentalhealth.platform.notification.entity.Notification;
import com.mentalhealth.platform.user.entity.User;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    long countByUser(User user);

    List<Notification> findTop5ByUserOrderByCreatedAtDesc(User user);

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    @Modifying
    @Query("""
        UPDATE Notification n
        SET n.isRead = true
        WHERE n.user = :user AND n.isRead = false
    """)
    int markAllAsReadByUser(@Param("user") User user);
}