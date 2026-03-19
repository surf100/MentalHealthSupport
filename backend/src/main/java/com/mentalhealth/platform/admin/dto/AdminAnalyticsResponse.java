package com.mentalhealth.platform.admin.dto;

import java.util.List;

public class AdminAnalyticsResponse {

    private List<DailyReportCount> reportsByDay;
    private List<CategoryCount> reportsByCategory;
    private List<StatusCount> reportsByStatus;
    private List<DailyReportCount> registrationsByDay;
    private long totalReports;
    private long criticalReports;
    private long pendingReports;
    private long totalUsers;
    private long totalForumPosts;
    private long flaggedForumPosts;
    private long pendingForumModeration;
    private long specialistEscalations;
    private long criticalForumPosts;

    public AdminAnalyticsResponse() {}

    public AdminAnalyticsResponse(
            List<DailyReportCount> reportsByDay,
            List<CategoryCount> reportsByCategory,
            List<StatusCount> reportsByStatus,
            List<DailyReportCount> registrationsByDay,
            long totalReports,
            long criticalReports,
            long pendingReports,
            long totalUsers,
            long totalForumPosts,
            long flaggedForumPosts,
            long pendingForumModeration,
            long specialistEscalations,
            long criticalForumPosts
    ) {
        this.reportsByDay = reportsByDay;
        this.reportsByCategory = reportsByCategory;
        this.reportsByStatus = reportsByStatus;
        this.registrationsByDay = registrationsByDay;
        this.totalReports = totalReports;
        this.criticalReports = criticalReports;
        this.pendingReports = pendingReports;
        this.totalUsers = totalUsers;
        this.totalForumPosts = totalForumPosts;
        this.flaggedForumPosts = flaggedForumPosts;
        this.pendingForumModeration = pendingForumModeration;
        this.specialistEscalations = specialistEscalations;
        this.criticalForumPosts = criticalForumPosts;
    }

    // ─── Getters ──────────────────────────────────────────────────────────────

    public List<DailyReportCount> getReportsByDay() { return reportsByDay; }
    public List<CategoryCount> getReportsByCategory() { return reportsByCategory; }
    public List<StatusCount> getReportsByStatus() { return reportsByStatus; }
    public List<DailyReportCount> getRegistrationsByDay() { return registrationsByDay; }
    public long getTotalReports() { return totalReports; }
    public long getCriticalReports() { return criticalReports; }
    public long getPendingReports() { return pendingReports; }
    public long getTotalUsers() { return totalUsers; }
    public long getTotalForumPosts() { return totalForumPosts; }
    public long getFlaggedForumPosts() { return flaggedForumPosts; }
    public long getPendingForumModeration() { return pendingForumModeration; }
    public long getSpecialistEscalations() { return specialistEscalations; }
    public long getCriticalForumPosts() { return criticalForumPosts; }

    // ─── Nested DTOs ──────────────────────────────────────────────────────────

    public static class DailyReportCount {
        private String date;
        private long count;

        public DailyReportCount() {}
        public DailyReportCount(String date, long count) {
            this.date = date;
            this.count = count;
        }

        public String getDate() { return date; }
        public long getCount() { return count; }
    }

    public static class CategoryCount {
        private String category;
        private long count;

        public CategoryCount() {}
        public CategoryCount(String category, long count) {
            this.category = category;
            this.count = count;
        }

        public String getCategory() { return category; }
        public long getCount() { return count; }
    }

    public static class StatusCount {
        private String status;
        private long count;

        public StatusCount() {}
        public StatusCount(String status, long count) {
            this.status = status;
            this.count = count;
        }

        public String getStatus() { return status; }
        public long getCount() { return count; }
    }
}
