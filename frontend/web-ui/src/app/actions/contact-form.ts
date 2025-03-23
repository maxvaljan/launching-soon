'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

// Define validation schemas for both forms
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(2, 'Subject is required'),
  department: z.string().min(2, 'Department is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

const businessInquirySchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  contactName: z.string().min(2, 'Contact name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  industry: z.string().min(2, 'Please select an industry'),
  message: z.string().optional(),
})

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const department = formData.get('department') as string
    const message = formData.get('message') as string
    
    // Validate form data
    const result = contactFormSchema.safeParse({ 
      name, email, subject, department, message 
    })
    
    if (!result.success) {
      return { 
        success: false, 
        message: result.error.errors[0].message 
      }
    }
    
    // Initialize Supabase client
    const supabase = await createServerSupabaseClient()
    
    // Store in Supabase
    const { error: dbError } = await supabase
      .from('contact_form_submissions')
      .insert({
        name,
        email,
        subject,
        department,
        message,
        form_source: 'contact_page'
      })
    
    if (dbError) {
      console.error('Database error:', dbError)
      return { 
        success: false, 
        message: 'Failed to submit your message. Please try again.' 
      }
    }
    
    // Get Resend API key and send email
    try {
      // Check if API key is defined
      if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not defined in environment variables')
        // Still return success since data was saved to Supabase
        return { 
          success: true, 
          message: 'Your message has been submitted successfully. We will contact you soon!' 
        }
      }
      
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      // Send email notification
      const { data, error: emailError } = await resend.emails.send({
        from: 'Maxmove <notifications@maxmove.com>',
        to: 'max@maxmove.com',
        subject: `Contact Form: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Department:</strong> ${department}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      })
      
      if (emailError) {
        console.error('Email sending error:', emailError)
        // Don't return error to user since the data was saved to the database
      } else {
        console.log('Email sent successfully:', data)
      }
    } catch (emailError) {
      console.error('Error in email sending:', emailError)
      // Still return success since data was saved to Supabase
    }
    
    return { 
      success: true, 
      message: 'Your message has been sent successfully. We will contact you soon!' 
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { 
      success: false, 
      message: 'An unexpected error occurred. Please try again.' 
    }
  }
}

export async function submitBusinessInquiry(prevState: any, formData: FormData) {
  try {
    // Extract form data
    const companyName = formData.get('companyName') as string
    const contactName = formData.get('contactName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string || ''
    const industry = formData.get('industry') as string
    const message = formData.get('message') as string || ''
    
    console.log('Business inquiry form data received:', { 
      companyName, contactName, email, phone, industry, message 
    })
    
    // Basic validation - return early if any required field is missing
    if (!companyName || !contactName || !email || !industry) {
      console.error('Validation failed: Missing required fields')
      return { 
        success: false, 
        message: 'Please fill out all required fields' 
      }
    }
    
    // Database insertion logic
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase environment variables not configured');
      return {
        success: false,
        message: 'Server configuration error. Please try again later.'
      };
    }

    // Create a direct client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false } // Don't persist auth state
    });

    console.log('Supabase client created, attempting database insertion...');

    // Insert directly into contact_form_submissions
    try {
      console.log('Inserting into contact_form_submissions table...');
      const { error: insertError } = await supabase
        .from('contact_form_submissions')
        .insert({
          name: contactName,
          email,
          company_name: companyName,
          phone,
          message,
          subject: `Business Inquiry: ${industry}`,
          department: 'Business Inquiries',
          form_source: 'business_page'
        });
      
      if (insertError) {
        console.error('Database error details:', JSON.stringify(insertError));
        return { 
          success: false, 
          message: 'Database error: ' + insertError.message
        };
      }
      
      console.log('Successfully inserted into contact_form_submissions');
    } catch (dbError) {
      console.error('Exception during database insertion:', dbError);
      return { 
        success: false, 
        message: 'A database error occurred. Please try again.'
      };
    }
    
    // Send email notification via Resend
    try {
      // Check if Resend API key is available
      if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY environment variable is missing');
      } else {
        console.log('Attempting to send email via Resend...');
        
        // Use dynamic import to avoid build-time issues
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        // Use a direct approach rather than HTML template
        const { data: emailData, error: emailError } = await resend.emails.send({
          from: 'Maxmove <contact@maxmove.com>', // Use a domain you've verified with Resend
          to: 'max@maxmove.com',
          subject: `Business Inquiry from ${companyName}`,
          text: `
Business Inquiry Details:
-------------------------
Company: ${companyName}
Contact Name: ${contactName}
Email: ${email}
Phone: ${phone || 'Not provided'}
Industry: ${industry}
Message: ${message || 'Not provided'}
          `,
        });
        
        if (emailError) {
          console.error('Failed to send email:', emailError);
          // Log detailed error information
          console.error('Email error details:', JSON.stringify(emailError));
        } else {
          console.log('Email sent successfully. Email ID:', emailData?.id);
        }
      }
    } catch (emailErr) {
      console.error('Exception sending email:', emailErr);
    }
    
    // Return success if we got this far (primary database insertion succeeded)
    return {
      success: true,
      message: 'Your business inquiry has been submitted. We will contact you soon!'
    }
  } catch (error) {
    console.error('Unhandled exception in submitBusinessInquiry:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    }
  }
} 