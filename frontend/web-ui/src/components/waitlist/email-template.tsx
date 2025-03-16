interface EmailTemplateProps {
  email: string
}

export function EmailTemplate({ email }: EmailTemplateProps) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Welcome to MAXMOVE Waitlist</title>
      </head>
      <body style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; padding: 20px;">
        <div style="max-width: 560px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #192338; font-size: 24px; margin-bottom: 16px;">Welcome to the MAXMOVE Waitlist!</h1>
          </div>
          <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">
            Thank you for joining our waitlist. We've received your email address (${email}) and will keep you updated on our progress and launch.
          </p>
          <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">
            We're working hard to create the best delivery platform for the German market, and we can't wait to share it with you!
          </p>
          <p style="color: #374151; font-size: 16px; margin-bottom: 8px;">Best regards,</p>
          <p style="color: #192338; font-size: 16px; font-weight: 500;">The MAXMOVE Team</p>
        </div>
      </body>
    </html>
  `
}