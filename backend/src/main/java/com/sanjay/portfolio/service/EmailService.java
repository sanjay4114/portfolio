package com.sanjay.portfolio.service;

import com.sanjay.portfolio.model.ContactMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendContactEmail(ContactMessage contactMessage) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("sanjaykalaivani30@gmail.com"); // Your email address
        message.setSubject("Portfolio Contact: " + contactMessage.getSubject());
        message.setText("Name: " + contactMessage.getName() + "\n" +
                       "Email: " + contactMessage.getEmail() + "\n" +
                       "Subject: " + contactMessage.getSubject() + "\n\n" +
                       "Message:\n" + contactMessage.getMessage());
        message.setFrom(contactMessage.getEmail()); // From the sender

        mailSender.send(message);
    }
}