# NOTE_SNAP

A modern note-taking and summarization application built with Next.js 15, featuring robust authentication, email verification, and AI-powered summarization capabilities.

## Features

- 🔐 **Robust Authentication System**
  - Email/password authentication
  - Social login (Google, GitHub, Discord)
  - Email verification requirement
  - Password reset functionality

- 📧 **Email Verification**
  - Multi-provider email support (Gmail, Outlook, SendGrid, etc.)
  - Custom HTML email templates
  - Automatic session refresh on verification
  - Development mode console logging

- 🐳 **Docker Support**
  - Containerized application
  - PostgreSQL database
  - pgAdmin for database management
  - Health checks and monitoring

- 🎨 **Modern UI**
  - Cyber-themed design
  - Responsive layout
  - Dark mode support
  - Smooth animations

## Getting Started

### Prerequisites

- Node.js 18+ or Docker
- PostgreSQL database (or use Docker Compose)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd note-snap
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure your environment**
   - Copy the relevant email configuration from `.env.email.example`
   - Set up your database connection
   - Configure OAuth providers (optional)

### Development

#### Using Docker (Recommended)

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

#### Using Node.js

```bash
# Start the development server
pnpm dev

# In another terminal, start the database
docker compose up -d postgres
```

## Email Configuration

The application supports multiple email providers for sending verification emails:

### Gmail
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password  # Generate at https://myaccount.google.com/apppasswords
```

### Outlook/Hotmail
```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### SendGrid
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
```

### Custom SMTP
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
```

### Testing Email Configuration

```bash
# Test your email configuration
node scripts/test-email.js your-email@example.com

# Interactive email setup helper
node scripts/setup-email.js
```

## Development

### Adding New Email Providers

1. Add the configuration to `EmailVerificationService.createTransporter()`
2. Add environment variable examples to `.env.email.example`
3. Update the README with configuration instructions

### Customizing Email Templates

Edit the HTML templates in `EmailVerificationService.sendVerificationEmail()` and `EmailVerificationService.sendPasswordResetEmail()`.

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `node scripts/test-email.js <email>` - Test email configuration
- `node scripts/setup-email.js` - Interactive email setup helper
- `scripts/setup-db.sh` - Set up database
- `scripts/test-setup.sh` - Test application setup

## Troubleshooting

### Email Issues

1. **Gmail**: Use App Passwords, not regular passwords
2. **Outlook**: May require additional security settings
3. **Corporate Email**: Check firewall and security policies
4. **Development**: Set `EMAIL_ENABLED=false` to use console logging

### Testing Email Configuration

```bash
# Test your email configuration
node scripts/test-email.js your-email@example.com
```
