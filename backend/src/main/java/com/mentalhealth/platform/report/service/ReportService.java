package com.mentalhealth.platform.report.service;

import com.mentalhealth.platform.report.dto.CreateReportRequest;
import com.mentalhealth.platform.report.dto.ReportDetailResponse;
import com.mentalhealth.platform.report.dto.ReportResponse;

import java.util.List;

public interface ReportService {

    ReportResponse createReport(String email, CreateReportRequest request);

    List<ReportResponse> getMyReports(String email);

    ReportDetailResponse getReportById(String email, Long reportId);
}