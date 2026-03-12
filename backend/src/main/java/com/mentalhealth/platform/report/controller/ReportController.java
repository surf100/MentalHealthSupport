package com.mentalhealth.platform.report.controller;

import com.mentalhealth.platform.report.dto.CreateReportRequest;
import com.mentalhealth.platform.report.dto.ReportDetailResponse;
import com.mentalhealth.platform.report.dto.ReportResponse;
import com.mentalhealth.platform.report.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // POST /api/reports — существующий endpoint, не тронут
    @PostMapping
    public ResponseEntity<ReportResponse> createReport(
            Authentication authentication,
            @Valid @RequestBody CreateReportRequest request
    ) {
        String email = authentication.getName();
        ReportResponse response = reportService.createReport(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/reports — список репортов текущего юзера
    @GetMapping
    public ResponseEntity<List<ReportResponse>> getMyReports(
            Authentication authentication
    ) {
        String email = authentication.getName();
        List<ReportResponse> reports = reportService.getMyReports(email);
        return ResponseEntity.ok(reports);
    }

    // GET /api/reports/{id} — детали одного репорта + timeline
    @GetMapping("/{id}")
    public ResponseEntity<ReportDetailResponse> getReportById(
            Authentication authentication,
            @PathVariable Long id
    ) {
        String email = authentication.getName();
        ReportDetailResponse response = reportService.getReportById(email, id);
        return ResponseEntity.ok(response);
    }
}