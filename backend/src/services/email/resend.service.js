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

// Frontend base URL for referral links
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * Send waiting list confirmation email with referral link
 * @param {string} email - Recipient email
 * @param {string} referralCode - UUID for referral tracking
 * @returns {Promise<Object>} - Response from email service
 */
exports.sendWaitingListConfirmation = async (email, referralCode) => {
  try {
    // Skip sending if in development, missing API key or resend package
    if (config.environment === 'development' || !config.resend.apiKey || !resend) {
      console.log(`[Mock] Sending confirmation email to ${email} with referral code ${referralCode}`);
      return {
        id: `mock-email-${Date.now()}`,
        status: 'success',
        message: 'Email scheduled for sending (mock)'
      };
    }

    const referralUrl = `${FRONTEND_URL}/referral/${referralCode}`;
    
    const { data, error } = await resend.emails.send({
      from: 'MaxMove <noreply@maxmove.de>',
      to: email,
      subject: 'Welcome to MaxMove Waiting List - Get 10% off Your First Delivery!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h1 style="color: #3B82F6; margin-bottom: 20px;">Thanks for joining MaxMove!</h1>
          
          <p>Hi there,</p>
          
          <p>Thank you for joining the MaxMove waiting list! We're excited to have you on board as we prepare for our launch.</p>
          
          <p>As a token of our appreciation, <strong>we're offering you 10% off your first delivery</strong> when we launch.</p>
          
          <h2 style="color: #3B82F6; margin-top: 30px;">Share with Friends & Earn Benefits</h2>
          
          <p>Invite your friends to join the waiting list, and <strong>both you and your friend will receive 10% off your first order</strong>!</p>
          
          <p>Here's your unique referral link:</p>
          
          <div style="background-color: #F3F4F6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <a href="${referralUrl}" style="color: #3B82F6; text-decoration: none; word-break: break-all;">${referralUrl}</a>
          </div>
          
          <a href="${referralUrl}" style="display: inline-block; background-color: #3B82F6; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; margin-top: 10px; font-weight: bold;">Share Your Invite Link</a>
          
          <p style="margin-top: 30px;">We'll keep you updated on our progress and let you know when we're ready to launch.</p>
          
          <p>Best regards,<br />The MaxMove Team</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #9CA3AF;">
            <p>© 2025 MaxMove. All rights reserved.</p>
            <p>You're receiving this email because you signed up for the MaxMove waiting list.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending confirmation email via Resend:', error);
      throw new Error(error.message);
    }

    return {
      id: data.id,
      status: 'success',
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Error in sendWaitingListConfirmation:', error);
    // Don't throw the error, just return a failed status
    return {
      status: 'error',
      message: error.message || 'Failed to send email'
    };
  }
};

/**
 * Send launch announcement email
 * @param {string} email - Recipient email
 * @param {string} referralCode - UUID for referral tracking
 * @returns {Promise<Object>} - Response from email service
 */
exports.sendLaunchAnnouncement = async (email, referralCode) => {
  try {
    // Skip sending if in development, missing API key or resend package
    if (config.environment === 'development' || !config.resend.apiKey || !resend) {
      console.log(`[Mock] Sending launch announcement to ${email} with referral code ${referralCode}`);
      return {
        id: `mock-email-${Date.now()}`,
        status: 'success',
        message: 'Email scheduled for sending (mock)'
      };
    }
    
    const discountUrl = `${FRONTEND_URL}/discount?code=${referralCode}`;
    
    const { data, error } = await resend.emails.send({
      from: 'MaxMove <noreply@maxmove.de>',
      to: email,
      subject: 'MaxMove is Now Live! Claim Your 10% Discount',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h1 style="color: #3B82F6; margin-bottom: 20px;">MaxMove is Live!</h1>
          
          <p>Hi there,</p>
          
          <p>Great news! MaxMove is now officially live and ready to serve you with the best delivery service in Germany.</p>
          
          <p>As promised, we're honoring your early support with a <strong>10% discount on your first order</strong>.</p>
          
          <div style="background-color: #F3F4F6; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px;">Your discount code:</p>
            <p style="font-size: 24px; font-weight: bold; margin: 10px 0; color: #3B82F6;">${referralCode.substring(0, 8).toUpperCase()}</p>
          </div>
          
          <a href="${discountUrl}" style="display: inline-block; background-color: #3B82F6; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; margin-top: 10px; font-weight: bold;">Claim Your Discount Now</a>
          
          <p style="margin-top: 30px;">Ready to experience the future of delivery? Download our app or visit our website to place your first order.</p>
          
          <p>Best regards,<br />The MaxMove Team</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #9CA3AF;">
            <p>© 2025 MaxMove. All rights reserved.</p>
            <p>You're receiving this email because you signed up for the MaxMove waiting list.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending launch announcement via Resend:', error);
      throw new Error(error.message);
    }

    return {
      id: data.id,
      status: 'success',
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Error in sendLaunchAnnouncement:', error);
    // Don't throw the error, just return a failed status
    return {
      status: 'error',
      message: error.message || 'Failed to send email'
    };
  }
};