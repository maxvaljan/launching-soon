const { validationResult } = require('express-validator');
const supabaseService = require('../services/database/supabase.service');
const { v4: uuidv4 } = require('uuid');
const resendService = require('../services/email/resend.service');

/**
 * Add email to waiting list
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.addToWaitingList = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, source, utm_source, referral_code } = req.body;

  try {
    // Check if email already exists to prevent duplicates
    const { data: existingEmail } = await supabaseService.supabase
      .from('waiting_list_emails')
      .select('id, email, referral_code')
      .eq('email', email)
      .single();

    // If email already exists, return existing details
    if (existingEmail) {
      return res.status(200).json({ 
        message: 'Email already registered', 
        data: {
          id: existingEmail.id,
          email: existingEmail.email,
          referral_code: existingEmail.referral_code
        }
      });
    }

    let referrerId = null;

    // If referral code provided, find the referrer
    if (referral_code) {
      const { data: referrer } = await supabaseService.supabase
        .from('waiting_list_emails')
        .select('id')
        .eq('referral_code', referral_code)
        .single();
      
      if (referrer) {
        referrerId = referrer.id;
        
        // Increment referral count for referrer
        await supabaseService.supabase
          .from('waiting_list_emails')
          .update({ referral_count: supabaseService.supabase.rpc('increment_counter', { row_id: referrer.id }) })
          .eq('id', referrer.id);
      }
    }

    // Add new email to waiting list
    const { data, error } = await supabaseService.supabase
      .from('waiting_list_emails')
      .insert([
        { 
          email, 
          source: source || 'api', 
          utm_source: utm_source || null,
          referrer_id: referrerId
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding email to waiting list:', error);
      return res.status(500).json({ message: 'Failed to add email to waiting list', error: error.message });
    }

    // Send confirmation email
    try {
      await resendService.sendWaitingListConfirmation(email, data.referral_code);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the request if email sending fails
    }

    return res.status(201).json({ 
      message: 'Email added to waiting list successfully', 
      data: {
        id: data.id,
        email: data.email,
        referral_code: data.referral_code
      }
    });
  } catch (error) {
    console.error('Error in waiting list controller:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

/**
 * Check if email exists in waiting list
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.checkEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const { data, error } = await supabaseService.supabase
      .from('waiting_list_emails')
      .select('id, email')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking email in waiting list:', error);
      return res.status(500).json({ message: 'Failed to check email', error: error.message });
    }

    return res.status(200).json({ 
      exists: !!data,
      data: data ? { id: data.id, email: data.email } : null
    });
  } catch (error) {
    console.error('Error in waiting list controller:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

/**
 * Get referrals by user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getReferrals = async (req, res) => {
  const { referral_code } = req.params;

  try {
    // Find the user by referral code
    const { data: user, error: userError } = await supabaseService.supabase
      .from('waiting_list_emails')
      .select('id, email, referral_count')
      .eq('referral_code', referral_code)
      .single();

    if (userError) {
      console.error('Error finding user by referral code:', userError);
      return res.status(404).json({ message: 'User not found', error: userError.message });
    }

    // Find referrals for this user
    const { data: referrals, error: referralsError } = await supabaseService.supabase
      .from('waiting_list_emails')
      .select('id, email, created_at')
      .eq('referrer_id', user.id);

    if (referralsError) {
      console.error('Error finding referrals:', referralsError);
      return res.status(500).json({ message: 'Failed to fetch referrals', error: referralsError.message });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        referral_count: user.referral_count
      },
      referrals: referrals
    });
  } catch (error) {
    console.error('Error in waiting list controller:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};