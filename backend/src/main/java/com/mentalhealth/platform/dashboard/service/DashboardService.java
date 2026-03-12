package com.mentalhealth.platform.dashboard.service;

import com.mentalhealth.platform.dashboard.dto.DashboardResponse;

public interface DashboardService {
    DashboardResponse getDashboardForCurrentUser(String email);
}