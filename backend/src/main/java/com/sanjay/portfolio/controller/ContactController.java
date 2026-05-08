package com.sanjay.portfolio.controller;

import com.sanjay.portfolio.model.ContactMessage;
import com.sanjay.portfolio.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<Map<String, String>> sendContactMessage(@Valid @RequestBody ContactMessage contactMessage) {
        try {
            emailService.sendContactEmail(contactMessage);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Message sent successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to send message. Please try again.");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> status() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "ok");
        response.put("message", "Contact backend is reachable.");
        return ResponseEntity.ok(response);
    }
}