# Portfolio Backend

This is the Spring Boot backend for Sanjay's portfolio contact form.

## Setup

1. Import this project into Eclipse as an existing Maven project.
2. Configure your email settings in `src/main/resources/application.properties`:
   - Replace `your-email@gmail.com` with your email address.
   - Replace `your-app-password` with your app password (for Gmail, enable 2FA and generate an app password).
   - If using a different email provider, update the host, port, and properties accordingly.

## Running the Application

1. Right-click on `PortfolioApplication.java` and run as Java Application.
2. The server will start on port 8080.

## API Endpoint

- POST `/api/contact` - Send a contact message
  - Body: JSON with `name`, `email`, `subject`, `message`
  - Response: JSON with success/error message

## CORS

The API allows requests from `http://localhost:3000`, `http://localhost:5500`, and `http://127.0.0.1:5500`.

If your frontend runs on a different URL/port, update the `@CrossOrigin` annotation in `ContactController.java` accordingly.

## Dependencies

- Spring Boot Web
- Spring Boot Mail
- Spring Boot Validation
- Lombok (optional)

## Notes

- Ensure your email provider allows SMTP access.
- For production, consider using environment variables for sensitive data.