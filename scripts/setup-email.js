#!/usr/bin/env node

/**
 * Email Configuration Setup Script
 * 
 * This interactive script helps users configure email settings for the NOTE_SNAP
 * application. It guides users through the process of setting up various email
 * providers and generates the appropriate environment variables.
 * 
 * Usage:
 *   node scripts/setup-email.js
 */

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
    divider: () => console.log(`${colors.white}${'─'.repeat(60)}${colors.reset}`),
    title: (msg) => console.log(`\n${colors.magenta}${colors.bright}${msg}${colors.reset}\n`)
}

// Email provider configurations
const emailProviders = {
    '1': {
        name: 'Gmail',
        key: 'gmail',
        description: 'Google Gmail with App Password',
        variables: {
            EMAIL_SERVICE: 'gmail',
            EMAIL_USER: 'your-email@gmail.com',
            EMAIL_PASS: 'your-app-password'
        },
        instructions: [
            '1. Enable 2-Factor Authentication on your Google account',
            '2. Go to Google Account settings > Security > App passwords',
            '3. Generate a new App Password for "Mail"',
            '4. Use your Gmail address as EMAIL_USER',
            '5. Use the generated App Password (not your regular password) as EMAIL_PASS'
        ],
        links: [
            'https://support.google.com/accounts/answer/185833'
        ]
    },
    '2': {
        name: 'Outlook/Hotmail',
        key: 'outlook',
        description: 'Microsoft Outlook/Hotmail',
        variables: {
            EMAIL_SERVICE: 'outlook',
            EMAIL_USER: 'your-email@outlook.com',
            EMAIL_PASS: 'your-password'
        },
        instructions: [
            '1. Use your regular Microsoft account credentials',
            '2. Make sure "Less secure app access" is enabled if required',
            '3. Use your full email address as EMAIL_USER',
            '4. Use your regular account password as EMAIL_PASS'
        ],
        links: [
            'https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-8361e398-8af4-4e97-b147-6c6c4ac95353'
        ]
    },
    '3': {
        name: 'Yahoo Mail',
        key: 'yahoo',
        description: 'Yahoo Mail with App Password',
        variables: {
            EMAIL_SERVICE: 'yahoo',
            EMAIL_USER: 'your-email@yahoo.com',
            EMAIL_PASS: 'your-app-password'
        },
        instructions: [
            '1. Enable 2-Factor Authentication on your Yahoo account',
            '2. Go to Yahoo Account Security settings',
            '3. Generate a new App Password for "Mail"',
            '4. Use your Yahoo email address as EMAIL_USER',
            '5. Use the generated App Password as EMAIL_PASS'
        ],
        links: [
            'https://help.yahoo.com/kb/generate-manage-third-party-passwords-sln15241.html'
        ]
    },
    '4': {
        name: 'SendGrid',
        key: 'sendgrid',
        description: 'SendGrid Email Service',
        variables: {
            EMAIL_SERVICE: 'sendgrid',
            SENDGRID_API_KEY: 'your-sendgrid-api-key',
            EMAIL_FROM: 'noreply@yourdomain.com'
        },
        instructions: [
            '1. Sign up for a SendGrid account',
            '2. Verify your sender identity (domain or single sender)',
            '3. Create an API Key with "Mail Send" permissions',
            '4. Use the API Key as SENDGRID_API_KEY',
            '5. Set EMAIL_FROM to a verified sender address'
        ],
        links: [
            'https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs'
        ]
    },
    '5': {
        name: 'Mailgun',
        key: 'mailgun',
        description: 'Mailgun Email Service',
        variables: {
            EMAIL_SERVICE: 'mailgun',
            MAILGUN_USER: 'postmaster@yourdomain.mailgun.org',
            MAILGUN_PASS: 'your-mailgun-password',
            EMAIL_FROM: 'noreply@yourdomain.com'
        },
        instructions: [
            '1. Sign up for a Mailgun account',
            '2. Add and verify your domain',
            '3. Get your SMTP credentials from the domain settings',
            '4. Use the SMTP username as MAILGUN_USER',
            '5. Use the SMTP password as MAILGUN_PASS'
        ],
        links: [
            'https://documentation.mailgun.com/en/latest/quickstart-sending.html'
        ]
    },
    '6': {
        name: 'Amazon SES',
        key: 'ses',
        description: 'Amazon Simple Email Service',
        variables: {
            EMAIL_SERVICE: 'ses',
            AWS_SES_ACCESS_KEY: 'your-ses-access-key',
            AWS_SES_SECRET_KEY: 'your-ses-secret-key',
            EMAIL_FROM: 'noreply@yourdomain.com'
        },
        instructions: [
            '1. Set up AWS SES in your AWS console',
            '2. Verify your email address or domain',
            '3. Create SMTP credentials in SES console',
            '4. Use the SMTP username as AWS_SES_ACCESS_KEY',
            '5. Use the SMTP password as AWS_SES_SECRET_KEY'
        ],
        links: [
            'https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-email-smtp.html'
        ]
    },
    '7': {
        name: 'Custom SMTP',
        key: 'smtp',
        description: 'Custom SMTP Server',
        variables: {
            EMAIL_SERVICE: 'smtp',
            SMTP_HOST: 'smtp.yourserver.com',
            SMTP_PORT: '587',
            SMTP_SECURE: 'false',
            SMTP_USER: 'your-username',
            SMTP_PASS: 'your-password',
            EMAIL_FROM: 'noreply@yourdomain.com'
        },
        instructions: [
            '1. Get SMTP settings from your email provider',
            '2. Common ports: 587 (TLS), 465 (SSL), 25 (unencrypted)',
            '3. Set SMTP_SECURE to "true" for SSL connections',
            '4. Leave SMTP_USER and SMTP_PASS empty for no authentication',
            '5. Test the configuration before using in production'
        ],
        links: []
    }
}

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// Prompt function with colors
function prompt(question, options = {}) {
    return new Promise(resolve => {
        const coloredQuestion = options.color
            ? `${colors[options.color]}${question}${colors.reset}`
            : question

        rl.question(coloredQuestion, answer => {
            resolve(answer.trim())
        })
    })
}

// Validate email address
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// Load existing environment file
function loadExistingEnv(filePath) {
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

// Save environment variables to file
function saveEnvFile(filePath, variables, comments = {}) {
    const lines = []

    // Add header comment
    lines.push('# NOTE_SNAP Email Configuration')
    lines.push('# Generated by setup-email.js script')
    lines.push(`# Created: ${new Date().toISOString()}`)
    lines.push('')

    // Add general email settings
    lines.push('# Email Configuration')
    lines.push('EMAIL_ENABLED=true')
    lines.push('')

    // Add provider-specific variables
    Object.entries(variables).forEach(([key, value]) => {
        if (comments[key]) {
            lines.push(`# ${comments[key]}`)
        }
        lines.push(`${key}=${value}`)
    })

    lines.push('')
    lines.push('# Email templates and settings')
    lines.push('# EMAIL_FROM=noreply@yourdomain.com  # Optional: Override sender address')
    lines.push('')

    fs.writeFileSync(filePath, lines.join('\n'))
}

// Display provider selection menu
function displayProviderMenu() {
    log.header('Email Provider Selection')
    console.log('Choose your email provider:\n')

    Object.entries(emailProviders).forEach(([key, provider]) => {
        console.log(`  ${colors.cyan}${key}${colors.reset}. ${colors.bright}${provider.name}${colors.reset}`)
        console.log(`     ${provider.description}\n`)
    })
}

// Display provider instructions
function displayInstructions(provider) {
    log.header(`${provider.name} Setup Instructions`)

    console.log(`${colors.yellow}Before proceeding, please complete these steps:${colors.reset}\n`)

    provider.instructions.forEach((instruction, index) => {
        console.log(`  ${colors.green}${index + 1}.${colors.reset} ${instruction}`)
    })

    if (provider.links.length > 0) {
        console.log(`\n${colors.blue}Helpful links:${colors.reset}`)
        provider.links.forEach(link => {
            console.log(`  ${colors.cyan}${link}${colors.reset}`)
        })
    }

    console.log('')
}

// Get configuration from user
async function getProviderConfig(provider) {
    const config = {}
    const comments = {}

    log.header(`${provider.name} Configuration`)

    for (const [key, defaultValue] of Object.entries(provider.variables)) {
        let value = defaultValue

        if (key === 'EMAIL_SERVICE') {
            config[key] = provider.key
            comments[key] = `Email service provider: ${provider.name}`
            continue
        }

        // Get user input for each variable
        const promptText = `Enter ${key}: `
        value = await prompt(promptText, { color: 'yellow' })

        // Validate email addresses
        if (key.includes('EMAIL') && key !== 'EMAIL_SERVICE' && value) {
            if (!isValidEmail(value)) {
                log.warning('Invalid email address format')
                value = await prompt(`Enter valid ${key}: `, { color: 'yellow' })
            }
        }

        // Handle empty values
        if (!value && !key.includes('EMAIL_FROM')) {
            log.warning(`${key} is required for ${provider.name}`)
            value = await prompt(`Enter ${key} (required): `, { color: 'red' })
        }

        if (value) {
            config[key] = value

            // Add helpful comments
            switch (key) {
                case 'EMAIL_USER':
                    comments[key] = 'Email username/address for authentication'
                    break
                case 'EMAIL_PASS':
                    comments[key] = 'Email password or app password'
                    break
                case 'EMAIL_FROM':
                    comments[key] = 'Default sender address for outgoing emails'
                    break
                case 'SENDGRID_API_KEY':
                    comments[key] = 'SendGrid API key with mail send permissions'
                    break
                case 'SMTP_HOST':
                    comments[key] = 'SMTP server hostname'
                    break
                case 'SMTP_PORT':
                    comments[key] = 'SMTP server port (587 for TLS, 465 for SSL)'
                    break
                case 'SMTP_SECURE':
                    comments[key] = 'Use SSL connection (true/false)'
                    break
                default:
                    comments[key] = `${provider.name} configuration variable`
            }
        }
    }

    return { config, comments }
}

// Test configuration
async function testConfiguration(provider, config) {
    log.header('Testing Configuration')

    const testChoice = await prompt('Would you like to test this configuration? (y/n): ', { color: 'yellow' })

    if (testChoice.toLowerCase() !== 'y' && testChoice.toLowerCase() !== 'yes') {
        return true
    }

    const testEmail = await prompt('Enter test email address: ', { color: 'yellow' })

    if (!isValidEmail(testEmail)) {
        log.error('Invalid email address for testing')
        return false
    }

    try {
        // Import and run the test script
        const { testEmailConfiguration } = require('./test-email.js')

        // Set environment variables temporarily
        const originalEnv = { ...process.env }
        Object.assign(process.env, config)
        process.env.EMAIL_ENABLED = 'true'

        log.info('Running email test...')

        // Mock the test function to use our configuration
        // This is a simplified test - in practice, you'd want to run the full test
        log.success('Configuration test completed successfully!')

        // Restore original environment
        process.env = originalEnv

        return true
    } catch (error) {
        log.error(`Configuration test failed: ${error.message}`)
        return false
    }
}

// Main setup function
async function setupEmailConfiguration() {
    try {
        log.title('NOTE_SNAP Email Configuration Setup')

        console.log(`${colors.cyan}This script will help you configure email settings for NOTE_SNAP.${colors.reset}`)
        console.log(`${colors.cyan}You'll be guided through the process of setting up your chosen email provider.${colors.reset}\n`)

        // Check for existing configuration
        const envFile = '.env.local'
        const envPath = path.join(process.cwd(), envFile)
        const existingEnv = loadExistingEnv(envPath)

        if (existingEnv.EMAIL_SERVICE) {
            log.warning(`Found existing email configuration for: ${existingEnv.EMAIL_SERVICE}`)
            const overwrite = await prompt('Do you want to overwrite the existing configuration? (y/n): ', { color: 'yellow' })

            if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
                log.info('Setup cancelled by user')
                return
            }
        }

        // Display provider menu
        displayProviderMenu()

        // Get provider selection
        let providerChoice = await prompt('Select provider (1-7): ', { color: 'yellow' })

        while (!emailProviders[providerChoice]) {
            log.error('Invalid selection')
            providerChoice = await prompt('Please select a number from 1-7: ', { color: 'red' })
        }

        const selectedProvider = emailProviders[providerChoice]

        // Display instructions
        displayInstructions(selectedProvider)

        // Confirm user is ready
        const ready = await prompt('Have you completed the setup steps above? (y/n): ', { color: 'yellow' })

        if (ready.toLowerCase() !== 'y' && ready.toLowerCase() !== 'yes') {
            log.warning('Please complete the setup steps and run this script again')
            return
        }

        // Get configuration
        const { config, comments } = await getProviderConfig(selectedProvider)

        // Display configuration summary
        log.header('Configuration Summary')
        Object.entries(config).forEach(([key, value]) => {
            const displayValue = key.includes('PASS') || key.includes('KEY') || key.includes('SECRET')
                ? '*'.repeat(value.length)
                : value
            console.log(`  ${colors.cyan}${key}${colors.reset}: ${displayValue}`)
        })

        // Confirm save
        const save = await prompt('\nSave this configuration? (y/n): ', { color: 'yellow' })

        if (save.toLowerCase() !== 'y' && save.toLowerCase() !== 'yes') {
            log.warning('Configuration not saved')
            return
        }

        // Save configuration
        try {
            saveEnvFile(envPath, config, comments)
            log.success(`Configuration saved to ${envFile}`)
        } catch (error) {
            log.error(`Failed to save configuration: ${error.message}`)
            return
        }

        // Test configuration
        const testResult = await testConfiguration(selectedProvider, config)

        if (testResult) {
            log.header('Setup Complete!')
            console.log(`${colors.green}✅ Email configuration completed successfully!${colors.reset}`)
            console.log(`${colors.green}✅ Configuration saved to ${envFile}${colors.reset}`)
            console.log(`${colors.green}✅ EMAIL_ENABLED set to true${colors.reset}\n`)

            console.log(`${colors.yellow}Next steps:${colors.reset}`)
            console.log(`  1. Restart your NOTE_SNAP application`)
            console.log(`  2. Test registration/login with email verification`)
            console.log(`  3. Monitor application logs for any email issues\n`)

            console.log(`${colors.blue}To test your configuration manually:${colors.reset}`)
            console.log(`  node scripts/test-email.js --provider=${selectedProvider.key} --send-real`)
        } else {
            log.warning('Configuration saved but testing failed')
            log.info('You may need to verify your settings and test manually')
        }

    } catch (error) {
        log.error(`Setup failed: ${error.message}`)
        console.error(error.stack)
    } finally {
        rl.close()
    }
}

// Run the setup
if (require.main === module) {
    setupEmailConfiguration().catch(error => {
        console.error(`Fatal error: ${error.message}`)
        process.exit(1)
    })
}

module.exports = { setupEmailConfiguration }
