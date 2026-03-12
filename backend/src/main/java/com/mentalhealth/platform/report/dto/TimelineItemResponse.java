package com.mentalhealth.platform.report.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.mentalhealth.platform.report.entity.ReportStatusHistory;

public class TimelineItemResponse {

    private Long id;
    private String title;
    private String description;

    @JsonFormat(pattern = "MMMM d, yyyy", locale = "en")
    private LocalDateTime occurredAt;

    public TimelineItemResponse() {}

    public static TimelineItemResponse from(ReportStatusHistory history) {
        TimelineItemResponse dto = new TimelineItemResponse();
        dto.id = history.getId();
       dto.title = history.getTitle();
        dto.description = history.getDescription();
        dto.occurredAt = history.getOccurredAt();
        return dto;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public LocalDateTime getOccurredAt() { return occurredAt; }
}