package com.mentalhealth.platform.admin.entity;

import com.mentalhealth.platform.user.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id", nullable = false)
    private User actor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AuditAction action;

    // Human-readable target label e.g. "maya@example.com", "RS-42"
    @Column(nullable = false, length = 255)
    private String target;

    @Column(nullable = false, length = 1000)
    private String details;

    @Column(name = "occurred_at", nullable = false)
    private LocalDateTime occurredAt;

    public AuditLog() {}

    public AuditLog(User actor, AuditAction action, String target, String details) {
        this.actor = actor;
        this.action = action;
        this.target = target;
        this.details = details;
        this.occurredAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public User getActor() { return actor; }
    public AuditAction getAction() { return action; }
    public String getTarget() { return target; }
    public String getDetails() { return details; }
    public LocalDateTime getOccurredAt() { return occurredAt; }
}