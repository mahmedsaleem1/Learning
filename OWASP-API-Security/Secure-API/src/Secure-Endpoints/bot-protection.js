import crypto from 'crypto';

/**
 * Cloudflare Bot Protection Middleware
 * Implements bot detection and blocking using Cloudflare's bot management headers
 */

class CloudflareBotProtection {
  constructor(options = {}) {
    this.botManagementScoreThreshold = options.botManagementScoreThreshold || 30;
    this.enableLogging = options.enableLogging !== false;
    this.blockSuspiciousBots = options.blockSuspiciousBots !== false;
    this.customHeaders = options.customHeaders || {};
    this.whitelist = options.whitelist || [];
  }

  /**
   * Middleware function for Express
   */
  middleware() {
    return (req, res, next) => {
      // Check if IP is whitelisted
      const clientIP = this.getClientIP(req);
      if (this.whitelist.includes(clientIP)) {
        if (this.enableLogging) {
          console.log(`✓ Whitelisted IP: ${clientIP}`);
        }
        return next();
      }

      // Extract Cloudflare Bot Management headers
      const botManagementScore = req.headers['cf-bot-management-score'];
      const botManagementJa3Hash = req.headers['cf-bot-management-ja3-hash'];
      const verifiedBotCategory = req.headers['cf-verified-bot-category'];
      const tlsVersion = req.headers['cf-tls-version'];
      const tlsCipherSuite = req.headers['cf-tls-cipher'];
      const asn = req.headers['cf-asn'];
      const country = req.headers['cf-ipcountry'];

      // Create bot detection result object
      const botDetectionResult = {
        timestamp: new Date().toISOString(),
        clientIP,
        score: botManagementScore ? parseInt(botManagementScore) : null,
        ja3Hash: botManagementJa3Hash,
        verifiedBot: verifiedBotCategory,
        tlsVersion,
        tlsCipherSuite,
        asn,
        country,
        headers: req.headers,
      };

      // Determine if request is likely from a bot
      const isSuspiciousBot = this.isSuspiciousBot(botDetectionResult);

      // Attach bot detection result to request
      req.botDetection = {
        ...botDetectionResult,
        isSuspicious: isSuspiciousBot,
        riskLevel: this.calculateRiskLevel(botDetectionResult),
      };

      if (this.enableLogging) {
        this.logBotDetection(req.botDetection);
      }

      // Block suspicious bots if configured
      if (this.blockSuspiciousBots && isSuspiciousBot) {
        return res.status(403).json({
          error: 'Access Denied',
          message: 'Bot activity detected. Please try again later.',
          requestId: this.generateRequestId(),
        });
      }

      next();
    };
  }

  /**
   * Determine if request appears to be from a suspicious bot
   */
  isSuspiciousBot(result) {
    // No bot management score means likely legitimate
    if (result.score === null || result.score === undefined) {
      return false;
    }

    // High score indicates bot-like behavior
    if (result.score > this.botManagementScoreThreshold) {
      return true;
    }

    // Check for verified bots (should be allowed)
    if (result.verifiedBot) {
      return false;
    }

    // Check for suspicious TLS patterns
    if (result.tlsVersion && this.isSuspiciousTLS(result.tlsVersion)) {
      return true;
    }

    return false;
  }

  /**
   * Check for suspicious TLS configurations
   */
  isSuspiciousTLS(tlsVersion) {
    // Bots often use outdated or unusual TLS versions
    const suspiciousVersions = ['TLSv1.0', 'TLSv1.1'];
    return suspiciousVersions.includes(tlsVersion);
  }

  /**
   * Calculate risk level based on various factors
   */
  calculateRiskLevel(result) {
    let riskScore = 0;

    if (!result.score) {
      return 'UNKNOWN';
    }

    // Score analysis
    if (result.score > 80) {
      return 'CRITICAL';
    } else if (result.score > 60) {
      return 'HIGH';
    } else if (result.score > this.botManagementScoreThreshold) {
      return 'MEDIUM';
    } else if (result.score > 10) {
      return 'LOW';
    }

    return 'SAFE';
  }

  /**
   * Extract client IP from request
   */
  getClientIP(req) {
    // Check common headers first
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }

    // Cloudflare header
    const cfConnectingIP = req.headers['cf-connecting-ip'];
    if (cfConnectingIP) {
      return cfConnectingIP;
    }

    // Direct connection
    return req.connection.remoteAddress || req.socket.remoteAddress;
  }

  /**
   * Log bot detection details
   */
  logBotDetection(detection) {
    const logEntry = {
      timestamp: detection.timestamp,
      clientIP: detection.clientIP,
      score: detection.score,
      riskLevel: detection.riskLevel,
      isSuspicious: detection.isSuspicious,
      country: detection.country,
      verifiedBot: detection.verifiedBot,
    };

    if (detection.isSuspicious) {
      console.warn('⚠️  SUSPICIOUS BOT DETECTED:', JSON.stringify(logEntry, null, 2));
    } else {
      console.log('✓ Bot Detection Check Passed:', JSON.stringify(logEntry, null, 2));
    }
  }

  /**
   * Generate unique request ID for tracking
   */
  generateRequestId() {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Add IP to whitelist
   */
  addToWhitelist(ip) {
    if (!this.whitelist.includes(ip)) {
      this.whitelist.push(ip);
      console.log(`✓ IP added to whitelist: ${ip}`);
    }
  }

  /**
   * Remove IP from whitelist
   */
  removeFromWhitelist(ip) {
    const index = this.whitelist.indexOf(ip);
    if (index > -1) {
      this.whitelist.splice(index, 1);
      console.log(`✓ IP removed from whitelist: ${ip}`);
    }
  }

  /**
   * Challenge endpoint for suspicious requests
   * Returns a challenge that legitimate users/bots should solve
   */
  challengeMiddleware() {
    return (req, res, next) => {
      if (!req.botDetection || !req.botDetection.isSuspicious) {
        return next();
      }

      // Return challenge response
      const challenge = {
        type: 'challenge',
        id: this.generateRequestId(),
        message: 'Please verify you are not a bot',
        timestamp: new Date().toISOString(),
      };

      return res.status(202).json(challenge);
    };
  }

  /**
   * Analytics endpoint for bot detection data
   */
  getAnalytics() {
    return {
      config: {
        threshold: this.botManagementScoreThreshold,
        blockSuspicious: this.blockSuspiciousBots,
        loggingEnabled: this.enableLogging,
        whitelistedIPs: this.whitelist.length,
      },
    };
  }
}

/**
 * Factory function to create middleware
 */
function createBotProtection(options = {}) {
  const protection = new CloudflareBotProtection(options);
  return protection.middleware();
}

/**
 * Challenge middleware factory
 */
function createBotChallenge(options = {}) {
  const protection = new CloudflareBotProtection(options);
  return protection.challengeMiddleware();
}

export { CloudflareBotProtection, createBotProtection, createBotChallenge };
