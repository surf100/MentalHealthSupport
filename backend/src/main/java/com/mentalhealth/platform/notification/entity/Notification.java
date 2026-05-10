package com.mentalhealth.platform.notification.entity;

import java.time.LocalDateTime;

import com.mentalhealth.platform.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Notification() {
    }

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public User getUser() { return user; }

    public String getTitle() { return title; }

    public String getMessage() { return message; }

    public NotificationType getType() { return type; }

    public boolean isRead() { return isRead; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }

    public void setUser(User user) { this.user = user; }

    public void setTitle(String title) { this.title = title; }

    public void setMessage(String message) { this.message = message; }

    public void setType(NotificationType type) { this.type = type; }

    public void setRead(boolean read) { isRead = read; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}