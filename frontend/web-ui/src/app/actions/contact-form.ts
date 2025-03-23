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
    
    // Create a direct Supabase client with the anon key
    // This is the most reliable way to insert data without auth issues
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase environment variables not configured')
      return {
        success: false,
        message: 'Server configuration error. Please try again later.'
      }
    }
    
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // 1. Insert into contact_form_submissions first (our primary target)
    console.log('Attempting to insert into contact_form_submissions...')
    const { data: contactFormData, error: contactFormError } = await supabase
      .from('contact_form_submissions')
      .insert({
        name: contactName,
        email,
        company_name: companyName,
        phone,
        message,
        subject: `Business Inquiry: ${industry}`,
        form_source: 'business_page'
      })
      .select()
    
    // Log detailed error information for debugging
    if (contactFormError) {
      console.error('Failed to insert into contact_form_submissions:', contactFormError)
      console.error('Error details:', JSON.stringify(contactFormError))
      
      return {
        success: false,
        message: 'Database error: ' + (contactFormError.message || 'Unknown error')
      }
    }
    
    console.log('Successfully inserted into contact_form_submissions')
    
    // 2. Then try to insert into business_inquiries (for backward compatibility)
    // But don't fail the whole process if this one fails
    try {
      console.log('Attempting to insert into business_inquiries...')
      const { error: businessInquiryError } = await supabase
        .from('business_inquiries')
        .insert({
          company_name: companyName,
          contact_name: contactName,
          email,
          phone,
          industry,
          message
        })
      
      if (businessInquiryError) {
        console.error('Failed to insert into business_inquiries:', businessInquiryError)
      } else {
        console.log('Successfully inserted into business_inquiries')
      }
    } catch (err) {
      console.error('Exception trying to insert into business_inquiries:', err)
      // Continue execution - this is just a backup table
    }
    
    // 3. Send email notification via Resend
    try {
      if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY not found in environment variables')
      } else {
        console.log('Attempting to send email via Resend...')
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        
        const { data: emailData, error: emailError } = await resend.emails.send({
          from: 'Maxmove <noreply@maxmove.com>',
          to: 'max@maxmove.com',
          subject: `Business Inquiry: ${companyName}`,
          html: `
            <h2>New Business Inquiry</h2>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Contact Name:</strong> ${contactName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Industry:</strong> ${industry}</p>
            <p><strong>Message:</strong></p>
            <p>${message ? message.replace(/\n/g, '<br>') : 'Not provided'}</p>
          `,
        })
        
        if (emailError) {
          console.error('Failed to send email:', emailError)
        } else {
          console.log('Email sent successfully:', emailData)
        }
      }
    } catch (emailErr) {
      console.error('Exception sending email:', emailErr)
      // Continue execution - database storage is primary, email is secondary
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