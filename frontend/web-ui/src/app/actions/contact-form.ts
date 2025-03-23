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
    const companyName = formData.get('companyName') as string
    const contactName = formData.get('contactName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string || undefined
    const industry = formData.get('industry') as string
    const message = formData.get('message') as string || undefined
    
    // Validate form data and log each field for debugging
    console.log('Business inquiry form data:', {
      companyName,
      contactName,
      email,
      phone,
      industry,
      message
    })
    
    const result = businessInquirySchema.safeParse({ 
      companyName, contactName, email, phone, industry, message 
    })
    
    if (!result.success) {
      console.error('Validation error:', result.error.errors)
      return { 
        success: false, 
        message: result.error.errors[0].message 
      }
    }
    
    try {
      // Create a direct Supabase client with anon key for insertions
      // This avoids any authentication issues with the server client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      const directClient = createClient(supabaseUrl, supabaseAnonKey)
      
      // Try with direct client first (contact_form_submissions)
      const { error: dbError2 } = await directClient
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
      
      if (dbError2) {
        console.error('Database error (contact_form_submissions with direct client):', dbError2)
        
        // Try with server client as fallback
        const supabase = await createServerSupabaseClient()
        
        // Attempt to use the server client for contact_form_submissions
        const { error: serverDbError } = await supabase
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
        
        if (serverDbError) {
          console.error('Database error (contact_form_submissions with server client):', serverDbError)
          return { 
            success: false, 
            message: 'Database error: ' + serverDbError.message
          }
        }
      }
      
      // Try to insert into business_inquiries as well, but don't fail if it errors
      const { error: dbError1 } = await directClient
        .from('business_inquiries')
        .insert({
          company_name: companyName,
          contact_name: contactName,
          email,
          phone,
          industry,
          message
        })
      
      if (dbError1) {
        console.error('Database error (business_inquiries):', dbError1)
        // Don't return error - we'll continue if contact_form_submissions worked
      }
    } catch (dbException) {
      console.error('Exception in database operations:', dbException)
      return { 
        success: false, 
        message: 'A database error occurred. Please try again.' 
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
          message: 'Your business inquiry has been submitted. We will contact you soon!' 
        }
      }
      
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      // Send email notification
      const { data, error: emailError } = await resend.emails.send({
        from: 'Maxmove <notifications@maxmove.com>',
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
      message: 'Your business inquiry has been submitted. We will contact you soon!' 
    }
  } catch (error) {
    console.error('Unexpected error in business inquiry submission:', error)
    return { 
      success: false, 
      message: 'An unexpected error occurred. Please try again.' 
    }
  }
} 