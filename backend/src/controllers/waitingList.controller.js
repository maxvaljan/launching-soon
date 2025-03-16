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
    console.log(`[Backend] Processing waiting list request for email: ${email}`);
    
    // Check if email already exists to prevent duplicates
    const { data: existingEmail, error: searchError } = await supabaseService.supabase
      .from('waiting_list_emails')
      .select('id, email, referral_code')
      .eq('email', email)
      .single();
      
    // Handle potential error in the search query
    if (searchError && searchError.code !== 'PGRST116') {
      console.error('[Backend] Error checking for existing email:', searchError);
      return res.status(500).json({ 
        message: 'Database error while checking email', 
        error: searchError.message 
      });
    }

    // If email already exists, return existing details
    if (existingEmail) {
      console.log(`[Backend] Email already registered: ${email}`);
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
        
        // Skip the RPC method and directly use the more reliable direct update approach
        // Fetch current count
        const { data: currentUser } = await supabaseService.supabase
          .from('waiting_list_emails')
          .select('referral_count')
          .eq('id', referrer.id)
          .single();
        
        const currentCount = currentUser?.referral_count || 0;
        
        // Update the count
        await supabaseService.supabase
          .from('waiting_list_emails')
          .update({ referral_count: currentCount + 1 })
          .eq('id', referrer.id);
      }
    }

    // Add new email to waiting list
    console.log(`[Backend] Adding new email to waiting list: ${email}`);
    
    const insertData = { 
      email, 
      source: source || 'api', 
      utm_source: utm_source || null,
      referrer_id: referrerId
    };
    
    console.log('[Backend] Insert data:', JSON.stringify(insertData));
    
    const { data, error } = await supabaseService.supabase
      .from('waiting_list_emails')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('[Backend] Error adding email to waiting list:', error);
      return res.status(500).json({ 
        message: 'Failed to add email to waiting list', 
        error: error.message,
        details: error.details || 'No additional details'
      });
    }
    
    console.log(`[Backend] Successfully added email to waiting list: ${email}`);

    // Send confirmation email
    try {
      console.log(`[Backend] Sending confirmation email to: ${email}`);
      const emailResult = await resendService.sendWaitingListConfirmation(email, data.referral_code);
      console.log(`[Backend] Email sending result:`, JSON.stringify(emailResult));
      
      if (emailResult.status === 'error') {
        console.warn(`[Backend] Non-critical email sending failure: ${emailResult.message}`);
      }
    } catch (emailError) {
      console.error('[Backend] Error sending confirmation email:', emailError);
      // Don't fail the request if email sending fails, but log it properly
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
      .select('id, email, referral_code')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking email in waiting list:', error);
      return res.status(500).json({ message: 'Failed to check email', error: error.message });
    }

    return res.status(200).json({ 
      exists: !!data,
      data: data ? { 
        id: data.id, 
        email: data.email,
        referral_code: data.referral_code
      } : null
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

/**
 * Get all waiting list entries (admin only)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getWaitingList = async (req, res) => {
  try {
    // In a production app, verify admin access here
    
    // Get all waiting list entries
    const { data, error } = await supabaseService.supabase
      .from('waiting_list_emails')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching waiting list:', error);
      return res.status(500).json({ message: 'Failed to fetch waiting list', error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in waiting list controller:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};