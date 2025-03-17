'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { EmailTemplate } from '@/components/waitlist/email-template'
import { render } from '@react-email/render'
import { redis } from '@/lib/redis'

const schema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function joinWaitlist(prevState: any, formData: FormData) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const email = formData.get('email')
    
    if (!email) {
      return { success: false, message: 'Email is required' }
    }
    
    const result = schema.safeParse({ email })
    
    if (!result.success) {
      return { success: false, message: result.error.errors[0].message }
    }

    // Store email in Upstash Redis
    await redis.sadd('waitlist_emails', email.toString())

    // Render the email template to HTML
    const emailHtml = await render(EmailTemplate({ email: email.toString() }))
    
    // Send welcome email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Maxmove <max@maxmove.com>',
      to: email.toString(),
      subject: 'Thank you for joining Maxmove\'s launch waitlist!',
      html: emailHtml,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, message: 'Failed to join waitlist. Please try again.' }
    }

    const count = await getWaitlistCount()

    return { 
      success: true, 
      message: 'You have been added to the waitlist! Check your email for confirmation.',
      count
    }
  } catch (error) {
    console.error('Error:', error)
    return { 
      success: false, 
      message: 'An unexpected error occurred. Please try again.' 
    }
  }
}

export async function getWaitlistCount() {
  try {
    const count = await redis.scard('waitlist_emails')
    return count
  } catch (error) {
    return 0
  }
}