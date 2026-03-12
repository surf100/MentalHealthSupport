package com.mentalhealth.platform.report.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.mentalhealth.platform.report.entity.Report;
import com.mentalhealth.platform.report.entity.ReportCategory;
import com.mentalhealth.platform.report.entity.ReportStatus;

public class ReportDetailResponse {

    private Long id;
    private String reference;
    private String title;
    private String description;
    private ReportCategory category;
    private ReportStatus status;
    private boolean isAnonymous;

    @JsonFormat(pattern = "MMMM d, yyyy", locale = "en")
    private LocalDateTime createdAt;

    private List<TimelineItemResponse> timeline;

    public ReportDetailResponse() {}

    public static ReportDetailResponse from(Report report, List<TimelineItemResponse> timeline) {
        ReportDetailResponse dto = new ReportDetailResponse();
        dto.id = report.getId();
        dto.reference = "RS-" + report.getId();
        dto.title = report.getTitle();
        dto.description = report.getDescription();
        dto.category = report.getCategory();
        dto.status = report.getStatus();
        dto.isAnonymous = report.isAnonymous();
        dto.createdAt = report.getCreatedAt();
        dto.timeline = timeline;
        return dto;
    }

    public Long getId() { return id; }
    public String getReference() { return reference; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public ReportCategory getCategory() { return category; }
    public ReportStatus getStatus() { return status; }
    public boolean isAnonymous() { return isAnonymous; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<TimelineItemResponse> getTimeline() { return timeline; }
}