package com.mentalhealth.platform.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SpecialistResponseRequest {

    @NotBlank(message = "Response message is required")
    @Size(max = 1000, message = "Response message must be 1000 characters or less")
    private String message;

    public SpecialistResponseRequest() {
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
