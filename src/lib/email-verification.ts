import { prisma } from '@/lib/db'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export interface EmailVerificationToken {
  identifier: string
  token: string
  expires: Date
}

interface EmailConfig {
  service?: string
  host?: string
  port?: number
  secure?: boolean
  auth?: {
    user: string
    pass: string
  }
}

export class EmailVerificationService {
  // Create email transporter based on configuration
  private static createTransporter() {
    const emailService = process.env.EMAIL_SERVICE || 'gmail'

    let config: EmailConfig

    switch (emailService.toLowerCase()) {
      case 'gmail':
        config = {
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER || '',
            pass: process.env.EMAIL_PASS || ''
          }
        }
        break

      case 'outlook':
      case 'hotmail':
        config = {
          service: 'hotmail',
          auth: {
            user: process.env.EMAIL_USER || '',
            pass: process.env.EMAIL_PASS || ''
          }
        }
        break

      case 'yahoo':
        config = {
          service: 'yahoo',
          auth: {
            user: process.env.EMAIL_USER || '',
            pass: process.env.EMAIL_PASS || ''
          }
        }
        break

      case 'sendgrid':
        config = {
          host: 'smtp.sendgrid.net',
          port: 587,
          secure: false,
          auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY || ''
          }
        }
        break

      case 'mailgun':
        config = {
          host: 'smtp.mailgun.org',
          port: 587,
          secure: false,
          auth: {
            user: process.env.MAILGUN_USER || '',
            pass: process.env.MAILGUN_PASS || ''
          }
        }
        break

      case 'ses':
        config = {
          host: 'email-smtp.us-east-1.amazonaws.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.AWS_SES_ACCESS_KEY || '',
            pass: process.env.AWS_SES_SECRET_KEY || ''
          }
        }
        break

      case 'smtp':
      default:
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;

        // Always provide the auth property to satisfy EmailConfig type
        config = {
          host: process.env.SMTP_HOST || 'localhost',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true'
        }

        if (smtpPass && smtpUser) {
          config.auth = {
            user: smtpUser,
            pass: smtpPass
          }
        }
        break
    }

    return nodemailer.createTransport(config)
  }
  // Generate a verification token
  static async generateVerificationToken(email: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Delete any existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email }
    })

    // Create new verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires
      }
    })

    return token
  }

  // Verify token and mark email as verified
  static async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const verificationToken = await prisma.verificationToken.findUnique({
        where: { token }
      })

      if (!verificationToken) {
        return { success: false, message: 'Invalid verification token' }
      }

      if (verificationToken.expires < new Date()) {
        // Clean up expired token
        await prisma.verificationToken.delete({
          where: { token }
        })
        return { success: false, message: 'Verification token has expired' }
      }

      // Update user's emailVerified field
      await prisma.user.update({
        where: { email: verificationToken.identifier },
        data: { emailVerified: new Date() }
      })

      // Delete the used token
      await prisma.verificationToken.delete({
        where: { token }
      })

      return { success: true, message: 'Email verified successfully' }
    } catch (error) {
      console.error('Email verification error:', error)
      return { success: false, message: 'Verification failed' }
    }
  }

  // Check if user's email is verified
  static async isEmailVerified(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true }
    })

    return !!user?.emailVerified
  }

  // Resend verification email
  static async resendVerification(email: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new Error('User not found')
    }

    if (user.emailVerified) {
      throw new Error('Email is already verified')
    }

    return await this.generateVerificationToken(email)
  }

  // Send verification email (production implementation)
  static async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`

    // Check if email is enabled
    if (process.env.EMAIL_ENABLED !== 'true') {
      // Fall back to console logging for development
      console.log(`
        ┌─────────────────────────────────────────────────────────────┐
        │                  EMAIL VERIFICATION                         │
        ├─────────────────────────────────────────────────────────────┤
        │ To: ${email.padEnd(50)} │
        │ Subject: Verify your NOTE_SNAP account                     │
        │                                                             │
        │ Click the link below to verify your email:                 │
        │ ${verificationUrl}                                        │
        │                                                             │
        │ This link expires in 24 hours.                             │
        └─────────────────────────────────────────────────────────────┘
      `)
      return
    }

    try {
      const transporter = this.createTransporter()

      const mailOptions = {
        from: {
          name: 'NOTE_SNAP',
          address: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@notepad.sys'
        },
        to: email,
        subject: 'Verify your NOTE_SNAP account',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify your NOTE_SNAP account</title>
            <style>
              body { font-family: 'Courier New', monospace; background-color: #0a0a0a; color: #00ff00; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border: 2px solid #00ff00; padding: 30px; }
              .header { text-align: center; margin-bottom: 30px; }
              .logo { font-size: 24px; font-weight: bold; color: #00ff00; margin-bottom: 10px; }
              .title { font-size: 18px; color: #00ff00; margin-bottom: 20px; }
              .content { line-height: 1.6; margin-bottom: 30px; }
              .button { display: inline-block; background-color: #00ff00; color: #000000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; margin: 20px 0; }
              .button:hover { background-color: #00cc00; }
              .footer { font-size: 12px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; }
              .code { background-color: #2a2a2a; padding: 10px; border-left: 4px solid #00ff00; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">NOTE_SNAP</div>
                <div class="title">&gt; EMAIL_VERIFICATION.exe</div>
              </div>
              
              <div class="content">
                <p>Hello there, neural network user!</p>
                
                <p>Welcome to NOTE_SNAP! To complete your account setup and access all features, please verify your email address.</p>
                
                <div class="code">
                  <strong>SYSTEM_STATUS:</strong> VERIFICATION_REQUIRED<br>
                  <strong>USER_EMAIL:</strong> ${email}<br>
                  <strong>EXPIRES_IN:</strong> 24 hours
                </div>
                
                <p>Click the button below to verify your email:</p>
                
                <a href="${verificationUrl}" class="button">VERIFY_EMAIL</a>
                
                <p>Or copy and paste this link into your browser:</p>
                <div class="code">${verificationUrl}</div>
                
                <p>If you didn't create an account with NOTE_SNAP, please ignore this email.</p>
              </div>
              
              <div class="footer">
                <p>This is an automated message from NOTE_SNAP. Please do not reply to this email.</p>
                <p>© 2025 NOTE_SNAP. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
          NOTE_SNAP - Email Verification
          
          Hello there, neural network user!
          
          Welcome to NOTE_SNAP! To complete your account setup and access all features, please verify your email address.
          
          SYSTEM_STATUS: VERIFICATION_REQUIRED
          USER_EMAIL: ${email}
          EXPIRES_IN: 24 hours
          
          Click the link below to verify your email:
          ${verificationUrl}
          
          This link expires in 24 hours.
          
          If you didn't create an account with NOTE_SNAP, please ignore this email.
          
          © 2025 NOTE_SNAP. All rights reserved.
        `
      }

      await transporter.sendMail(mailOptions)
      console.log(`✅ Verification email sent to ${email}`)
    } catch (error) {
      console.error('❌ Failed to send verification email:', error)
      throw new Error('Failed to send verification email')
    }
  }

  // Send password reset email
  static async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

    // Check if email is enabled
    if (process.env.EMAIL_ENABLED !== 'true') {
      // Fall back to console logging for development
      console.log(`
        ┌─────────────────────────────────────────────────────────────┐
        │                  PASSWORD RESET                             │
        ├─────────────────────────────────────────────────────────────┤
        │ To: ${email.padEnd(50)} │
        │ Subject: Reset your NOTE_SNAP password                     │
        │                                                             │
        │ Click the link below to reset your password:               │
        │ ${resetUrl}                                               │
        │                                                             │
        │ This link expires in 1 hour.                               │
        └─────────────────────────────────────────────────────────────┘
      `)
      return
    }

    try {
      const transporter = this.createTransporter()

      const mailOptions = {
        from: {
          name: 'NOTE_SNAP',
          address: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@notepad.sys'
        },
        to: email,
        subject: 'Reset your NOTE_SNAP password',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset your NOTE_SNAP password</title>
            <style>
              body { font-family: 'Courier New', monospace; background-color: #0a0a0a; color: #ff6b6b; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border: 2px solid #ff6b6b; padding: 30px; }
              .header { text-align: center; margin-bottom: 30px; }
              .logo { font-size: 24px; font-weight: bold; color: #ff6b6b; margin-bottom: 10px; }
              .title { font-size: 18px; color: #ff6b6b; margin-bottom: 20px; }
              .content { line-height: 1.6; margin-bottom: 30px; }
              .button { display: inline-block; background-color: #ff6b6b; color: #000000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; margin: 20px 0; }
              .button:hover { background-color: #ff5252; }
              .footer { font-size: 12px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; }
              .code { background-color: #2a2a2a; padding: 10px; border-left: 4px solid #ff6b6b; margin: 15px 0; }
              .warning { background-color: #331a1a; padding: 15px; border-left: 4px solid #ff6b6b; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">NOTE_SNAP</div>
                <div class="title">&gt; PASSWORD_RESET.exe</div>
              </div>
              
              <div class="content">
                <p>Hello there, neural network user!</p>
                
                <p>A password reset has been requested for your NOTE_SNAP account.</p>
                
                <div class="code">
                  <strong>SYSTEM_STATUS:</strong> PASSWORD_RESET_REQUESTED<br>
                  <strong>USER_EMAIL:</strong> ${email}<br>
                  <strong>EXPIRES_IN:</strong> 1 hour
                </div>
                
                <p>Click the button below to reset your password:</p>
                
                <a href="${resetUrl}" class="button">RESET_PASSWORD</a>
                
                <p>Or copy and paste this link into your browser:</p>
                <div class="code">${resetUrl}</div>
                
                <div class="warning">
                  <strong>⚠️ SECURITY_WARNING:</strong><br>
                  If you didn't request this password reset, please ignore this email. Your account is secure and no action is needed.
                </div>
              </div>
              
              <div class="footer">
                <p>This is an automated message from NOTE_SNAP. Please do not reply to this email.</p>
                <p>© 2025 NOTE_SNAP. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
          NOTE_SNAP - Password Reset
          
          Hello there, neural network user!
          
          A password reset has been requested for your NOTE_SNAP account.
          
          SYSTEM_STATUS: PASSWORD_RESET_REQUESTED
          USER_EMAIL: ${email}
          EXPIRES_IN: 1 hour
          
          Click the link below to reset your password:
          ${resetUrl}
          
          This link expires in 1 hour.
          
          ⚠️ SECURITY_WARNING:
          If you didn't request this password reset, please ignore this email. Your account is secure and no action is needed.
          
          © 2025 NOTE_SNAP. All rights reserved.
        `
      }

      await transporter.sendMail(mailOptions)
      console.log(`✅ Password reset email sent to ${email}`)
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error)
      throw new Error('Failed to send password reset email')
    }
  }
}
