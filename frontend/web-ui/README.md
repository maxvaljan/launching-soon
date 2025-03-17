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

## Contact Form

The contact form on the contact page sends all information to max@maxmove.com. When a user submits the form, they will receive a success message and be redirected to the home page.
