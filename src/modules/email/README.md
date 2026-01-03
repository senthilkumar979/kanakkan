# Email Module

This module handles email sending using Resend.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME=Kanakkan
ENABLE_MONTHLY_SUMMARY_EMAIL=true  # Optional: Enable monthly summary emails
```

3. Get your Resend API key from [resend.com](https://resend.com)

## Features

### Welcome Email
- Automatically sent when a user registers
- Non-blocking execution (doesn't affect registration flow)
- Optional execution (gracefully handles missing API key)

### Monthly Summary Email
- Feature-flagged via `ENABLE_MONTHLY_SUMMARY_EMAIL`
- Can be triggered via API endpoint: `POST /api/email/monthly-summary`
- Includes:
  - Total income and expense
  - Net amount
  - Top spending categories
  - Transaction count

## Usage

### Welcome Email
Automatically sent during user registration. No manual action required.

### Monthly Summary Email
Send via API:

```typescript
POST /api/email/monthly-summary
Content-Type: application/json

{
  "month": "12",
  "year": 2024
}
```

## Architecture

- **Server-only**: All email functions run on the server
- **Template-based**: HTML templates in `email.templates.ts`
- **Optional execution**: Gracefully handles missing configuration
- **Non-blocking**: Welcome email doesn't block registration flow

