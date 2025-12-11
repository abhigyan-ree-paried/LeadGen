# Ree.Paired Backend - Twilio SMS OTP

Backend server for handling SMS OTP verification using Twilio.

## Setup Instructions

### 1. Move Backend Files

```bash
cd /Users/abhigyanraj/Desktop
# Move files to backend folder
mv reeparied-p1/backend-package.json reepaired-backend/package.json
mv reeparied-p1/backend-server.js reepaired-backend/server.js
mv reeparied-p1/backend-.env reepaired-backend/.env
mv reeparied-p1/backend-.gitignore reepaired-backend/.gitignore
```

### 2. Install Dependencies

```bash
cd reepaired-backend
npm install
```

### 3. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

### Send OTP
- **POST** `/api/send-otp`
- Body: `{ "phoneNumber": "+919876543210" }`
- Response: `{ "success": true, "message": "OTP sent successfully" }`

### Verify OTP
- **POST** `/api/verify-otp`
- Body: `{ "phoneNumber": "+919876543210", "otp": "123456" }`
- Response: `{ "success": true, "message": "OTP verified successfully" }`

## Environment Variables

Already configured in `.env`:
- `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
- `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
- `TWILIO_PHONE_NUMBER`: +17752546978
- `PORT`: 3001

## Testing

1. Start the backend server
2. Use Postman or curl to test endpoints
3. Check console for OTP (in development mode)

## Notes

- OTPs expire after 5 minutes
- OTPs are stored in memory (use Redis for production)
- Development mode shows OTP in response for testing
