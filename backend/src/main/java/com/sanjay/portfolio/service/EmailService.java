package com.sanjay.portfolio.service;

import com.sanjay.portfolio.model.ContactMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendContactEmail(ContactMessage contactMessage) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("sanjaykalaivani30@gmail.com"); // Your email address
        message.setSubject("Portfolio Contact: " + contactMessage.getSubject());
        message.setText("Name: " + contactMessage.getName() + "\n" +
                       "Email: " + contactMessage.getEmail() + "\n" +
                       "Subject: " + contactMessage.getSubject() + "\n\n" +
                       "Message:\n" + contactMessage.getMessage());
        
        // Gmail SMTP does not allow setting 'From' to arbitrary emails (like the user's email).
        // It must be the authenticated user's email. We use 'ReplyTo' for the user's email instead.
        message.setFrom(senderEmail); 
        message.setReplyTo(contactMessage.getEmail());

        mailSender.send(message);
    }
}