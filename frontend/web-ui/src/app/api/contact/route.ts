import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, department } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the department name from the value
    let departmentName = department;
    switch (department) {
      case 'customer-support':
        departmentName = 'Customer Support';
        break;
      case 'business':
        departmentName = 'Business Inquiries';
        break;
      case 'driver':
        departmentName = 'Driver Relations';
        break;
      case 'technical':
        departmentName = 'Technical Support';
        break;
      case 'media':
        departmentName = 'Press & Media';
        break;
    }

    // Log the contact form submission if email sending is not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Contact form submission:', {
        name,
        email,
        department: departmentName,
        subject,
        message,
        recipient: 'max@maxmove.com',
      });
      
      // Save to database or other service if available
      // For now, we'll just return success since this is development
      return NextResponse.json({
        success: true,
        message: 'Email credentials not configured, but data was received and logged',
      });
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Set up email data
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"MaxMove Website" <noreply@maxmove.com>`,
      to: 'max@maxmove.com',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Department: ${departmentName}
        
        Message:
        ${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #192338;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Department:</strong> ${departmentName}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <h3 style="color: #192338; margin-top: 0;">Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    return NextResponse.json(
      { error: 'Failed to process your message' },
      { status: 500 }
    );
  }
}
