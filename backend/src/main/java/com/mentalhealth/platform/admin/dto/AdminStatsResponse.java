package com.mentalhealth.platform.admin.dto;

public class AdminStatsResponse {

    private long totalUsers;
    private long totalAdmins;
    private long totalBanned;

    public AdminStatsResponse() {}

    public AdminStatsResponse(long totalUsers, long totalAdmins, long totalBanned) {
        this.totalUsers = totalUsers;
        this.totalAdmins = totalAdmins;
        this.totalBanned = totalBanned;
    }

    public long getTotalUsers() { return totalUsers; }
    public long getTotalAdmins() { return totalAdmins; }
    public long getTotalBanned() { return totalBanned; }
}