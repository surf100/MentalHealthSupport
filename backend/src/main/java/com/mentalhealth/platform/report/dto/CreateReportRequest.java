package com.mentalhealth.platform.report.dto;

import com.mentalhealth.platform.report.entity.ReportCategory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateReportRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    @NotNull(message = "Category is required")
    private ReportCategory category;

    @NotNull(message = "Anonymous flag is required")
    private Boolean isAnonymous;

    public CreateReportRequest() {
    }

    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public ReportCategory getCategory() { return category; }
    public Boolean getIsAnonymous() { return isAnonymous; }

    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setCategory(ReportCategory category) { this.category = category; }
    public void setIsAnonymous(Boolean isAnonymous) { this.isAnonymous = isAnonymous; }
}