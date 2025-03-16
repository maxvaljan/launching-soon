/**
 * Email service (placeholder)
 * @module services/email/resend.service
 */

/**
 * Send waiting list confirmation email with referral link
 * @param {string} email - Recipient email
 * @param {string} referralCode - UUID for referral tracking
 * @returns {Promise<Object>} - Response from email service
 */
exports.sendWaitingListConfirmation = async (email, referralCode) => {
  console.log(`[Mock] Sending confirmation email to ${email} with referral code ${referralCode}`);
  
  // Return a mock successful response
  return {
    id: `mock-email-${Date.now()}`,
    status: 'success',
    message: 'Email scheduled for sending (mock)'
  };
};

/**
 * Send launch announcement email
 * @param {string} email - Recipient email
 * @param {string} referralCode - UUID for referral tracking
 * @returns {Promise<Object>} - Response from email service
 */
exports.sendLaunchAnnouncement = async (email, referralCode) => {
  console.log(`[Mock] Sending launch announcement to ${email} with referral code ${referralCode}`);
  
  // Return a mock successful response
  return {
    id: `mock-email-${Date.now()}`,
    status: 'success',
    message: 'Email scheduled for sending (mock)'
  };
};