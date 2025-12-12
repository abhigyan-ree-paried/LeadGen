const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
    'https://landing.reepaired.com',
    'https://lead-gen-blond.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            return callback(null, true);
        }

        // Allow all Render.com domains (for frontend deployed on Render)
        if (origin.includes('.onrender.com')) {
            return callback(null, true);
        }

        // Check if origin is in allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Twilio client
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// In-memory OTP storage (for production, use Redis or database)
const otpStore = new Map();

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        // Generate OTP
        const otp = generateOTP();

        // Store OTP with 5-minute expiry
        otpStore.set(phoneNumber, {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
        });

        // Send SMS via Twilio with WebOTP format
        const message = await client.messages.create({
            body: `Your Ree.Paired verification code is: ${otp}. Valid for 5 minutes.\n\n@landing.reepaired.com #${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

        console.log(`OTP sent to ${phoneNumber}: ${otp}`);
        console.log(`Message SID: ${message.sid}`);

        res.json({
            success: true,
            message: 'OTP sent successfully',
            // For testing only - remove in production
            otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({
            error: 'Failed to send OTP',
            details: error.message
        });
    }
});

// Verify OTP endpoint
app.post('/api/verify-otp', (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({ error: 'Phone number and OTP are required' });
        }

        // Get stored OTP
        const stored = otpStore.get(phoneNumber);

        if (!stored) {
            return res.status(400).json({
                success: false,
                error: 'No OTP found for this number. Please request a new OTP.'
            });
        }

        // Check if OTP expired
        if (Date.now() > stored.expiresAt) {
            otpStore.delete(phoneNumber);
            return res.status(400).json({
                success: false,
                error: 'OTP has expired. Please request a new OTP.'
            });
        }

        // Verify OTP
        if (stored.otp === otp) {
            otpStore.delete(phoneNumber); // Remove used OTP
            return res.json({
                success: true,
                message: 'OTP verified successfully'
            });
        } else {
            return res.status(400).json({
                success: false,
                error: 'Invalid OTP. Please try again.'
            });
        }

    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({
            error: 'Failed to verify OTP',
            details: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` Twilio phone number: ${process.env.TWILIO_PHONE_NUMBER}`);
});
