package com.mentalhealth.platform.dashboard.controller;

import com.mentalhealth.platform.dashboard.dto.DashboardResponse;
import com.mentalhealth.platform.dashboard.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(Authentication authentication) {
        String email = authentication.getName();
        DashboardResponse response = dashboardService.getDashboardForCurrentUser(email);
        return ResponseEntity.ok(response);
    }
}