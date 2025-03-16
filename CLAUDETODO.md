# Claude's To-Do List (Next Steps) - Updated

## **1. Store Emails from waiting list in a Live Database (Supabase)** ✅
### **Tasks:**
- ✅ Replace localStorage email storage with Supabase database.
- ✅ Create a `waiting_list_emails` table in Supabase:
  - ✅ `id` (UUID, primary key)
  - ✅ `email` (unique, indexed)
  - ✅ `created_at` (timestamp, default `now()`)
  - ✅ `source` (e.g., `'popup'`, `'waiting_list_section' referral`)
- ✅ Update the EmailCollectionPopup & WaitingList components to send email data to Supabase.

## **2. Send an Instant Confirmation Email (Resend API)** ✅
### **Tasks:**
- ✅ Integrate instant confirmation for waiting list sign up
- ✅ Email should:
  - ✅ Thank the user for signing up.
  - ✅ Provide a **referral link** (custom URL with referral tracking).
  - ✅ Offer a **10% discount on first Maxmove order** if they invite friend who signs up on waiting list

## **3. Implement Referral System** ✅
### **Tasks:**
- ✅ Generate unique referral codes 
- ✅ Store referral codes in Supabase linked to each user.
- ✅ Track referrals and offer a **discount when a referred friend signs up**.
- ✅ Create a **page for referrals**

## **4. Automated Launch Announcement Emails** ✅
### **Tasks:**
- ✅ Set up **Resend** to send automated launch emails.
- ✅ Create an email sequence:
  - ✅ **Day 1**: "Thanks for signing up! Invite friends for 10% off."
  - ✅ **Launch Day**: "We're live! Claim your discount now."
- 🔄 Automate email sending using Supabase Functions or a CRON job (implementation pending schedule setup).

## **5. Optimize Popup & UI Behavior** ✅
### **Tasks:**
- ✅ Improve popup logic:
  - ✅ Ensure **email is stored in Supabase, not localStorage**.
  - ✅ Prevent showing the popup if email exists in Supabase.
  - ✅ Check Supabase before displaying popups (debounce API calls to avoid spam requests).
- ✅ Make the signup flow smoother

## **6. Admin Dashboard to Track Signups & Referrals** ✅
### **Tasks:**
- ✅ Implement Admin Panel for:
  - ✅ View waiting list signups.
  - ✅ Track referral statistics.
  - ✅ Export email data.
- ✅ Use **Next.js Admin UI** with Supabase data

### **Future Enhancements:**
- Add authentication to admin dashboard
- Implement CRON job for launch announcements
- Add custom email templates for different campaigns
- Add dashboard analytics for conversion tracking