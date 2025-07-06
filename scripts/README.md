# Email Configuration Scripts

This directory contains scripts to help configure and test email functionality for NOTE_SNAP.

## Scripts

### 🧪 test-email.js
Tests email configuration to ensure it works correctly.

**Usage:**
```bash
# Basic test (console output only)
node scripts/test-email.js

# Test specific provider
node scripts/test-email.js --provider=gmail

# Test with specific recipient
node scripts/test-email.js --to=test@example.com

# Send actual test email
node scripts/test-email.js --provider=gmail --to=test@example.com --send-real

# Show help
node scripts/test-email.js --help
```

**Supported Providers:**
- `gmail` - Gmail with App Password
- `outlook` - Outlook/Hotmail
- `yahoo` - Yahoo Mail with App Password
- `sendgrid` - SendGrid Email Service
- `mailgun` - Mailgun Email Service
- `ses` - Amazon SES
- `smtp` - Custom SMTP server

### ⚙️ setup-email.js
Interactive script to configure email settings.

**Usage:**
```bash
node scripts/setup-email.js
```

This script will:
1. Guide you through selecting an email provider
2. Show setup instructions for your chosen provider
3. Collect your configuration details
4. Save settings to `.env.local`
5. Optionally test the configuration

## Environment Files

The scripts will look for configuration in these files (in order):
1. `.env.local` (recommended for local development)
2. `.env`
3. `.env.email`

## Email Providers Setup

### Gmail
1. Enable 2-Factor Authentication
2. Generate an App Password for Mail
3. Use your Gmail address and App Password

Required variables:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_ENABLED=true
```

### SendGrid
1. Sign up for SendGrid account
2. Verify sender identity
3. Create API key with Mail Send permissions

Required variables:
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-api-key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_ENABLED=true
```

### Custom SMTP
For any SMTP server:

Required variables:
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.yourserver.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_ENABLED=true
```

## Testing

### Console Mode
When `EMAIL_ENABLED` is not set to `"true"`, emails will be displayed in the console instead of being sent. This is useful for development.

### Real Email Mode
Set `EMAIL_ENABLED=true` in your environment to send actual emails.

## Troubleshooting

### Common Issues

**Gmail "Invalid login"**
- Make sure you're using an App Password, not your regular password
- Enable 2-Factor Authentication first

**SendGrid authentication failed**
- Verify your API key is correct
- Check that the API key has Mail Send permissions
- Ensure your sender address is verified

**SMTP connection timeout**
- Check your SMTP host and port settings
- Verify firewall settings allow SMTP connections
- Try different ports (587, 465, 25)

**"Missing credentials" error**
- Ensure all required environment variables are set
- Check for typos in variable names
- Verify values don't have extra spaces or quotes

### Debug Mode

For detailed logging, you can modify the scripts to show more information:

```bash
# Show environment variables (be careful with sensitive data)
node -e "console.log(process.env)" | grep EMAIL

# Test with verbose output
node scripts/test-email.js --provider=gmail --send-real
```

### Manual Testing

You can manually test the email service using Node.js:

```javascript
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
})

transporter.sendMail({
  from: 'your-email@gmail.com',
  to: 'test@example.com',
  subject: 'Test Email',
  text: 'This is a test email'
}).then(info => {
  console.log('Email sent:', info.messageId)
}).catch(error => {
  console.error('Error:', error)
})
```

## Security Notes

- Never commit `.env.local` or `.env` files to version control
- Use App Passwords instead of regular passwords when possible
- Rotate API keys and passwords regularly
- Use environment-specific configurations for production

## Integration

These scripts work with the NOTE_SNAP email system in:
- `src/lib/email-verification.ts` - Main email service
- User registration email verification
- Password reset emails
- System notifications
