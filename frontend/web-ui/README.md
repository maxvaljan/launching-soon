# MaxMove Web UI

This is the front-end web interface for the MaxMove delivery platform.

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

To enable email functionality for the contact form, set up the following environment variables in your `.env.local` file:

```
EMAIL_SERVER=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
EMAIL_FROM="MaxMove Website <noreply@maxmove.com>"
```

If these variables are not set, the application will still function, but contact form submissions will only be logged to the console instead of being sent via email.

## Features

- Home page with service information
- About page
- Contact form - sends emails to max@maxmove.com
- Business solutions
- Driver registration
- Responsive design

## Contact Forms

The web UI includes two contact forms:

1. **General Contact Form** - Located on the `/contact` page, allows users to send general inquiries or support requests.
2. **Business Inquiry Form** - Located on the `/business` page, specifically for business partnership or enterprise solution inquiries.

### How it works

Both forms implement a hybrid approach:

1. Form submissions are stored in a Supabase database (`contact_form_submissions` table)
2. Email notifications are sent to max@maxmove.com using Resend

### Setup Requirements

To enable the contact form functionality:

1. Create the necessary Supabase tables:
   - `contact_form_submissions` (main table for all contact form data)
   - `business_inquiries` (used for backward compatibility)

2. Set up Resend:
   - Create a Resend account at [resend.com](https://resend.com)
   - Generate an API key
   - Add the API key to your environment variables as `RESEND_API_KEY`
   - Verify your sending domain in Resend

The application will still function if Resend is not configured, as all submissions are saved to the database regardless of email delivery status.

### Environment Variables

```
# Required for contact forms
RESEND_API_KEY=your-resend-api-key
```

## Contact Form

The contact form on the contact page sends all information to max@maxmove.com. When a user submits the form, they will receive a success message and be redirected to the home page.
