import express from 'express';

import { createBotProtection } from './Secure-Endpoints/bot-protection.js';
import limiter from './Secure-Endpoints/rate-limiting.js';
import checkAllowedDomain from './Secure-Endpoints/ssrf.js';
import { sanitizeExternalWeatherData } from './Secure-Endpoints/unsafe-external-apis.js';

const app = express();

// --- 1. CLOUDFLARE CONFIGURATION ---
// MUST tell Express to trust Cloudflare's IP headers
app.set('trust proxy', 1); 

// --- 2. SECURITY HEADERS ---
app.use(express.json({ limit: '10kb' })); // Prevents "Unrestricted Resource Consumption" (Large JSON)
app.disable('x-powered-by'); // Hides that you are using Express

// --- 3. GLOBAL BOT PROTECTION ---
// This runs on every single request
app.use(createBotProtection({
  botManagementScoreThreshold: 30, // Block scores 1-29
  blockSuspiciousBots: true
}));

// --- 4. ROUTES ---

// Apply the rate limiter specifically to the health check
app.get('/health', limiter, (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'secure-api',
    // We pass the score back so you can see it while testing
    debug_bot_score: req.headers['cf-bot-management-score'] || 'N/A'
  });
});

// SSRF protected endpoint - only allows fetching from specific domains
app.get('/fetch-image', checkAllowedDomain, (req, res) => {
  res.status(200).json({
    ok: true,
    hostname: req.userUrl.hostname,
    url: req.userUrl.href
  });
});

// Third-party API response is sanitized before returning it.
app.get('/safe-external-data', sanitizeExternalWeatherData, (req, res) => {
  res.status(200).json(res.locals.weather);
});

// --- 5. ERROR HANDLING ---
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;