const express = require('express');
const { body, param } = require('express-validator');
const waitingListController = require('../controllers/waitingList.controller');

const router = express.Router();

/**
 * @route POST /api/waiting-list
 * @description Add email to waiting list
 * @access Public
 */
router.post(
  '/',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('source').optional().isString().withMessage('Source must be a string'),
    body('utm_source').optional().isString().withMessage('UTM source must be a string'),
    body('referral_code').optional().isUUID(4).withMessage('Referral code must be a valid UUID')
  ],
  waitingListController.addToWaitingList
);

/**
 * @route GET /api/waiting-list/check/:email
 * @description Check if email exists in waiting list
 * @access Public
 */
router.get(
  '/check/:email',
  [
    param('email').isEmail().withMessage('Valid email is required')
  ],
  waitingListController.checkEmail
);

/**
 * @route GET /api/waiting-list/referrals/:referral_code
 * @description Get referrals by referral code
 * @access Public
 */
router.get(
  '/referrals/:referral_code',
  [
    param('referral_code').isUUID(4).withMessage('Referral code must be a valid UUID')
  ],
  waitingListController.getReferrals
);

/**
 * @route GET /api/waiting-list/admin
 * @description Get all waiting list entries (admin only)
 * @access Private/Admin
 */
router.get(
  '/admin',
  // In production, add middleware to verify admin access
  // adminMiddleware,
  waitingListController.getWaitingList
);

module.exports = router;