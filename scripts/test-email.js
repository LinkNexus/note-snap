#!/usr/bin/env node

/**
 * Email Configuration Test Script
 * 
 * This script tests various email configurations to ensure they work properly
 * with the NOTE_SNAP application. It supports multiple email providers and
 * can test both console output and actual email sending.
 * 
 * Usage:
 *   node scripts/test-email.js
 *   node scripts/test-email.js --provider gmail
 *   node scripts/test-email.js --to user@example.com
 *   node scripts/test-email.js --send-real
 */

const nodemailer = require('nodemailer')
const readline = require('readline')
const fs = require('fs')
const path = require('path')

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
}

const log = {
    info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
    warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
    header: (msg) => console.log(`\n${colors.cyan}${colors.bright}=== ${msg} ===${colors.reset}\n`),
    divider: () => console.log(`${colors.white}${'─'.repeat(60)}${colors.reset}`)
}

// Load environment variables
function loadEnvFile(filePath) {
    if (!fs.existsSync(filePath)) return {}

    const content = fs.readFileSync(filePath, 'utf8')
    const env = {}

    content.split('\n').forEach(line => {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith('#')) {
            const [key, ...valueParts] = trimmed.split('=')
            if (key && valueParts.length > 0) {
                env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
            }
        }
    })

    return env
}

// Email service configurations
const emailConfigs = {
    gmail: {
        name: 'Gmail',
        service: 'gmail',
        requiredVars: ['EMAIL_USER', 'EMAIL_PASS'],
        instructions: 'Use App Password (not regular password). Enable 2FA and generate an App Password.'
    },
    outlook: {
        name: 'Outlook/Hotmail',
        service: 'hotmail',
        requiredVars: ['EMAIL_USER', 'EMAIL_PASS'],
        instructions: 'Use your regular Microsoft account credentials.'
    },
    yahoo: {
        name: 'Yahoo Mail',
        service: 'yahoo',
        requiredVars: ['EMAIL_USER', 'EMAIL_PASS'],
        instructions: 'Use App Password. Enable 2FA and generate an App Password.'
    },
    sendgrid: {
        name: 'SendGrid',
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        requiredVars: ['SENDGRID_API_KEY'],
        instructions: 'Use your SendGrid API Key as the password with "apikey" as username.'
    },
    mailgun: {
        name: 'Mailgun',
        host: 'smtp.mailgun.org',
        port: 587,
        secure: false,
        requiredVars: ['MAILGUN_USER', 'MAILGUN_PASS'],
        instructions: 'Use your Mailgun SMTP credentials.'
    },
    ses: {
        name: 'Amazon SES',
        host: 'email-smtp.us-east-1.amazonaws.com',
        port: 587,
        secure: false,
        requiredVars: ['AWS_SES_ACCESS_KEY', 'AWS_SES_SECRET_KEY'],
        instructions: 'Use your AWS SES SMTP credentials.'
    },
    smtp: {
        name: 'Custom SMTP',
        requiredVars: ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'],
        instructions: 'Configure custom SMTP server settings.'
    }
}

// Create transporter based on provider
function createTransporter(provider, env) {
    const config = emailConfigs[provider]
    if (!config) {
        throw new Error(`Unknown email provider: ${provider}`)
    }

    let transportConfig = {}

    switch (provider) {
        case 'gmail':
        case 'outlook':
        case 'yahoo':
            transportConfig = {
                service: config.service,
                auth: {
                    user: env.EMAIL_USER,
                    pass: env.EMAIL_PASS
                }
            }
            break

        case 'sendgrid':
            transportConfig = {
                host: config.host,
                port: config.port,
                secure: config.secure,
                auth: {
                    user: 'apikey',
                    pass: env.SENDGRID_API_KEY
                }
            }
            break

        case 'mailgun':
            transportConfig = {
                host: config.host,
                port: config.port,
                secure: config.secure,
                auth: {
                    user: env.MAILGUN_USER,
                    pass: env.MAILGUN_PASS
                }
            }
            break

        case 'ses':
            transportConfig = {
                host: config.host,
                port: config.port,
                secure: config.secure,
                auth: {
                    user: env.AWS_SES_ACCESS_KEY,
                    pass: env.AWS_SES_SECRET_KEY
                }
            }
            break

        case 'smtp':
            const smtpUser = env.SMTP_USER
            const smtpPass = env.SMTP_PASS

            transportConfig = {
                host: env.SMTP_HOST,
                port: parseInt(env.SMTP_PORT || '587'),
                secure: env.SMTP_SECURE === 'true'
            }

            // Only add auth if credentials are provided
            if (smtpUser && smtpPass) {
                transportConfig.auth = {
                    user: smtpUser,
                    pass: smtpPass
                }
            }
            break
    }

    return nodemailer.createTransport(transportConfig)
}

// Validate configuration
function validateConfig(provider, env) {
    const config = emailConfigs[provider]
    const missing = config.requiredVars.filter(varName => !env[varName])

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
}

// Test email template
function createTestEmail(toEmail, provider) {
    const testTime = new Date().toISOString()

    return {
        from: {
            name: 'NOTE_SNAP Test',
            address: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'test@notepad.sys'
        },
        to: toEmail,
        subject: `NOTE_SNAP Email Test - ${provider.toUpperCase()} - ${testTime}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>NOTE_SNAP Email Test</title>
        <style>
          body { font-family: 'Courier New', monospace; background-color: #0a0a0a; color: #00ff00; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border: 2px solid #00ff00; padding: 30px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #00ff00; margin-bottom: 10px; }
          .title { font-size: 18px; color: #00ff00; margin-bottom: 20px; }
          .content { line-height: 1.6; }
          .code { background-color: #2a2a2a; padding: 10px; border-left: 4px solid #00ff00; margin: 15px 0; }
          .success { color: #00ff00; font-weight: bold; }
          .footer { font-size: 12px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">NOTE_SNAP</div>
            <div class="title">&gt; EMAIL_TEST.exe</div>
          </div>
          
          <div class="content">
            <p>Hello there, neural network administrator!</p>
            
            <p><span class="success">✅ EMAIL SYSTEM TEST SUCCESSFUL</span></p>
            
            <div class="code">
              <strong>TEST_DETAILS:</strong><br>
              <strong>PROVIDER:</strong> ${provider.toUpperCase()}<br>
              <strong>TIMESTAMP:</strong> ${testTime}<br>
              <strong>RECIPIENT:</strong> ${toEmail}<br>
              <strong>STATUS:</strong> TRANSMISSION_COMPLETE
            </div>
            
            <p>Your email configuration is working correctly! This test confirms that:</p>
            <ul>
              <li>SMTP connection established successfully</li>
              <li>Authentication credentials are valid</li>
              <li>Email delivery system is operational</li>
              <li>HTML formatting is rendered properly</li>
            </ul>
            
            <p>You can now use this email configuration for:</p>
            <ul>
              <li>User registration verification</li>
              <li>Password reset notifications</li>
              <li>System alerts and notifications</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>This is an automated test message from NOTE_SNAP email system.</p>
            <p>© 2025 NOTE_SNAP. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `
      NOTE_SNAP - Email System Test
      
      Hello there, neural network administrator!
      
      ✅ EMAIL SYSTEM TEST SUCCESSFUL
      
      TEST_DETAILS:
      PROVIDER: ${provider.toUpperCase()}
      TIMESTAMP: ${testTime}
      RECIPIENT: ${toEmail}
      STATUS: TRANSMISSION_COMPLETE
      
      Your email configuration is working correctly! This test confirms that:
      - SMTP connection established successfully
      - Authentication credentials are valid
      - Email delivery system is operational
      - Text formatting is working properly
      
      You can now use this email configuration for:
      - User registration verification
      - Password reset notifications
      - System alerts and notifications
      
      This is an automated test message from NOTE_SNAP email system.
      © 2025 NOTE_SNAP. All rights reserved.
    `
    }
}

// Interactive prompt
function prompt(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close()
            resolve(answer.trim())
        })
    })
}

// Main test function
async function testEmailConfiguration() {
    log.header('NOTE_SNAP Email Configuration Test')

    // Parse command line arguments
    const args = process.argv.slice(2)
    let provider = args.find(arg => arg.startsWith('--provider='))?.split('=')[1]
    let toEmail = args.find(arg => arg.startsWith('--to='))?.split('=')[1]
    const sendReal = args.includes('--send-real')
    const showHelp = args.includes('--help') || args.includes('-h')

    if (showHelp) {
        console.log(`
Usage: node scripts/test-email.js [options]

Options:
  --provider=<name>    Email provider to test (gmail, outlook, yahoo, sendgrid, mailgun, ses, smtp)
  --to=<email>         Test email recipient
  --send-real          Actually send email (default: console output only)
  --help, -h           Show this help message

Available providers: ${Object.keys(emailConfigs).join(', ')}

Examples:
  node scripts/test-email.js --provider=gmail --to=test@example.com
  node scripts/test-email.js --provider=sendgrid --send-real
  node scripts/test-email.js --to=admin@company.com --send-real
    `)
        return
    }

    try {
        // Load environment variables
        const envFiles = ['.env.local', '.env', '.env.email']
        let env = { ...process.env }

        for (const file of envFiles) {
            const filePath = path.join(process.cwd(), file)
            if (fs.existsSync(filePath)) {
                const fileEnv = loadEnvFile(filePath)
                env = { ...env, ...fileEnv }
                log.info(`Loaded environment from ${file}`)
            }
        }

        // Determine email provider
        if (!provider) {
            provider = env.EMAIL_SERVICE || 'gmail'
        }

        log.info(`Testing email provider: ${emailConfigs[provider]?.name || provider}`)

        // Validate provider
        if (!emailConfigs[provider]) {
            log.error(`Unknown email provider: ${provider}`)
            log.info(`Available providers: ${Object.keys(emailConfigs).join(', ')}`)
            return
        }

        // Validate configuration
        try {
            validateConfig(provider, env)
            log.success('Configuration validation passed')
        } catch (error) {
            log.error(`Configuration validation failed: ${error.message}`)
            log.info(`Instructions for ${emailConfigs[provider].name}: ${emailConfigs[provider].instructions}`)
            return
        }

        // Get recipient email
        if (!toEmail) {
            toEmail = env.EMAIL_FROM || env.EMAIL_USER || await prompt('Enter test recipient email: ')
        }

        if (!toEmail) {
            log.error('No recipient email specified')
            return
        }

        log.info(`Test recipient: ${toEmail}`)

        // Test mode
        if (!sendReal) {
            log.header('Console Test Mode')
            log.info('Showing console output only. Use --send-real flag to send actual email...')

            const testEmail = createTestEmail(toEmail, provider)

            console.log(`
┌─────────────────────────────────────────────────────────────┐
│                    EMAIL TEST RESULT                       │
├─────────────────────────────────────────────────────────────┤
│ Provider: ${provider.toUpperCase().padEnd(50)} │
│ From: ${testEmail.from.address.padEnd(54)} │
│ To: ${toEmail.padEnd(56)} │
│ Subject: ${testEmail.subject.substring(0, 47).padEnd(50)} │
│                                                             │
│ ✅ Configuration appears valid                              │
│ ✅ Email template generated successfully                     │
│ ✅ Console output working                                    │
│                                                             │
│ To test actual sending, use --send-real flag               │
└─────────────────────────────────────────────────────────────┘
      `)

            log.success('Console test completed successfully!')
            return
        }

        // Real email test
        log.header('Real Email Test')
        log.warning('This will attempt to send an actual email...')

        // Create transporter
        let transporter
        try {
            transporter = createTransporter(provider, env)
            log.success('Email transporter created successfully')
        } catch (error) {
            log.error(`Failed to create transporter: ${error.message}`)
            return
        }

        // Verify transporter
        try {
            log.info('Verifying SMTP connection...')
            await transporter.verify()
            log.success('SMTP connection verified')
        } catch (error) {
            log.error(`SMTP verification failed: ${error.message}`)
            log.info('This might still work for sending emails, continuing...')
        }

        // Create and send test email
        const testEmail = createTestEmail(toEmail, provider)

        try {
            log.info('Sending test email...')
            const result = await transporter.sendMail(testEmail)
            log.success('Test email sent successfully!')
            log.info(`Message ID: ${result.messageId}`)

            if (result.response) {
                log.info(`Server response: ${result.response}`)
            }

            console.log(`
┌─────────────────────────────────────────────────────────────┐
│                   EMAIL SENT SUCCESSFULLY                  │
├─────────────────────────────────────────────────────────────┤
│ ✅ SMTP connection established                               │
│ ✅ Authentication successful                                 │
│ ✅ Email delivered to server                                 │
│ ✅ Message ID received                                       │
│                                                             │
│ Check the recipient inbox for the test email.              │
│ The email should arrive within a few minutes.              │
└─────────────────────────────────────────────────────────────┘
      `)

        } catch (error) {
            log.error(`Failed to send email: ${error.message}`)

            // Common error suggestions
            if (error.message.includes('Invalid login')) {
                log.warning('Try using an App Password instead of your regular password')
            } else if (error.message.includes('connection refused')) {
                log.warning('Check your SMTP host and port settings')
            } else if (error.message.includes('Missing credentials')) {
                log.warning('Verify all required environment variables are set')
            }

            return
        }

    } catch (error) {
        log.error(`Unexpected error: ${error.message}`)
        console.error(error.stack)
    }
}

// Run the test
if (require.main === module) {
    testEmailConfiguration().catch(error => {
        log.error(`Fatal error: ${error.message}`)
        process.exit(1)
    })
}

module.exports = { testEmailConfiguration, createTransporter, validateConfig }
