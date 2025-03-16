/**
 * Email service using Resend
 * @module services/email/resend.service
 */

let resend;
const config = require('../../config');

try {
  const { Resend } = require('resend');
  // Initialize Resend with API key if the package is available
  resend = new Resend(config.resend.apiKey);
} catch (error) {
  console.warn('Resend package not available, using mock implementation:', error.message);
  resend = null;
}

// Frontend base URL
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

