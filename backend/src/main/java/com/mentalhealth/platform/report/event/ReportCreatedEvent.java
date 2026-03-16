package com.mentalhealth.platform.report.event;

public class ReportCreatedEvent {

    private final Long reportId;

    public ReportCreatedEvent(Long reportId) {
        this.reportId = reportId;
    }

    public Long getReportId() {
        return reportId;
    }
}
