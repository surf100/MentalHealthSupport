package com.mentalhealth.platform.admin.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.mentalhealth.platform.admin.entity.AuditAction;
import com.mentalhealth.platform.admin.entity.AuditLog;

public class AuditLogResponse {

    private Long id;
    private String actor;         // nickname — используется на frontend как "actor"
    private AuditAction action;
    private String target;
    private String details;

    @JsonFormat(pattern = "MMMM d, yyyy", locale = "en")
    private LocalDateTime occurredAt;

    public AuditLogResponse() {}

    public static AuditLogResponse from(AuditLog log) {
        AuditLogResponse dto = new AuditLogResponse();
        dto.id = log.getId();
        dto.actor = log.getActor().getNickname();
        dto.action = log.getAction();
        dto.target = log.getTarget();
        dto.details = log.getDetails();
        dto.occurredAt = log.getOccurredAt();
        return dto;
    }

    public Long getId() { return id; }
    public String getActor() { return actor; }
    public AuditAction getAction() { return action; }
    public String getTarget() { return target; }
    public String getDetails() { return details; }
    public LocalDateTime getOccurredAt() { return occurredAt; }
}