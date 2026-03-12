package com.mentalhealth.platform.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mentalhealth.platform.auth.dto.AccountSettingsResponse;
import com.mentalhealth.platform.auth.dto.AuthResponse;
import com.mentalhealth.platform.auth.dto.CurrentUserResponse;
import com.mentalhealth.platform.auth.dto.SignInRequest;
import com.mentalhealth.platform.auth.dto.SignUpRequest;
import com.mentalhealth.platform.auth.dto.UpdateAccountRequest;
import com.mentalhealth.platform.auth.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/sign-up")
    public ResponseEntity<AuthResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signUp(request));
    }

    @PostMapping("/sign-in")
    public ResponseEntity<AuthResponse> signIn(@Valid @RequestBody SignInRequest request) {
        return ResponseEntity.ok(authService.signIn(request));
    }

    @GetMapping("/me")
    public ResponseEntity<CurrentUserResponse> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(authService.getCurrentUser(email));
    }

    @PutMapping("/update-account")
    public ResponseEntity<AccountSettingsResponse> updateAccount(
            Authentication authentication,
            @RequestBody UpdateAccountRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(authService.updateAccount(email, request));
    }
}