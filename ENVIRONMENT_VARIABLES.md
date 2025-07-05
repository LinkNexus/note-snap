# Environment Variables Reference

This document describes all environment variables used by NOTE_SNAP.

## Core Application Settings

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXTAUTH_URL` | Base URL of your application | `http://localhost:3000` | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js | - | Yes |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |

## Email Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `EMAIL_ENABLED` | Enable/disable email sending | `false` | No |
| `EMAIL_SERVICE` | Email service provider | `gmail` | No |
| `EMAIL_FROM` | Default "from" email address | `noreply@notepad.sys` | No |

### Gmail
| Variable | Description | Required |
|----------|-------------|----------|
| `EMAIL_USER` | Gmail email address | Yes |
| `EMAIL_PASS` | Gmail App Password | Yes |

### Outlook/Hotmail
| Variable | Description | Required |
|----------|-------------|----------|
| `EMAIL_USER` | Outlook email address | Yes |
| `EMAIL_PASS` | Outlook password | Yes |

### Yahoo
| Variable | Description | Required |
|----------|-------------|----------|
| `EMAIL_USER` | Yahoo email address | Yes |
| `EMAIL_PASS` | Yahoo password | Yes |

### SendGrid
| Variable | Description | Required |
|----------|-------------|----------|
| `SENDGRID_API_KEY` | SendGrid API key | Yes |

### Mailgun
| Variable | Description | Required |
|----------|-------------|----------|
| `MAILGUN_USER` | Mailgun SMTP username | Yes |
| `MAILGUN_PASS` | Mailgun SMTP password | Yes |

### Amazon SES
| Variable | Description | Required |
|----------|-------------|----------|
| `AWS_SES_ACCESS_KEY` | AWS Access Key | Yes |
| `AWS_SES_SECRET_KEY` | AWS Secret Key | Yes |

### Custom SMTP
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SMTP_HOST` | SMTP server hostname | `localhost` | Yes |
| `SMTP_PORT` | SMTP server port | `587` | No |
| `SMTP_SECURE` | Use SSL/TLS | `false` | No |
| `SMTP_USER` | SMTP username | - | Yes |
| `SMTP_PASS` | SMTP password | - | Yes |

## OAuth Providers (Optional)

### Google OAuth
| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |

### GitHub OAuth
| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | No |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | No |

### Discord OAuth
| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_CLIENT_ID` | Discord OAuth client ID | No |
| `DISCORD_CLIENT_SECRET` | Discord OAuth client secret | No |

## Development Settings

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |

## Example Configuration

```env
# Core Settings
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/notepad

# Email Configuration (Gmail)
EMAIL_ENABLED=true
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourapp.com

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Security Notes

1. **Never commit `.env.local` to version control**
2. **Use App Passwords for Gmail, not regular passwords**
3. **Generate strong random values for `NEXTAUTH_SECRET`**
4. **Rotate secrets regularly in production**
5. **Use environment-specific configurations**

## Setup Tools

- `node scripts/setup-email.js` - Interactive email configuration
- `node scripts/test-email.js <email>` - Test email configuration
