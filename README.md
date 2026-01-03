# Kanakkan

A modern, full-stack personal finance management application built with Next.js, TypeScript, and MongoDB. Track your income, expenses, and gain insights through beautiful dashboards and analytics.

![Kanakkan](docs/screenshots/dashboard.png)

## Features

- 💰 **Income & Expense Tracking** - Record and categorize your financial transactions
- 📊 **Interactive Dashboards** - Visualize your finances with charts and analytics
- 🏷️ **Category Management** - Organize transactions with categories and subcategories
- 💳 **Payment Methods** - Track money modes and card usage
- 📧 **Email Notifications** - Welcome emails and monthly summaries (optional)
- 🔐 **Secure Authentication** - JWT-based auth with refresh tokens
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎨 **Modern UI** - Built with Tailwind CSS and Radix UI primitives

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Hook Form** with Zod validation

### Backend
- **Next.js API Routes** (Server Actions)
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Resend** for email delivery

### Development
- **TypeScript** (Strict mode)
- **ESLint** + **Prettier**
- **Zod** for schema validation

## Architecture

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   └── page.tsx           # Home page
├── modules/               # Feature modules (business logic)
│   ├── auth/             # Authentication module
│   ├── category/         # Category management
│   ├── dashboard/        # Dashboard aggregation
│   ├── email/            # Email service
│   ├── expense/          # Expense management
│   ├── income/           # Income management
│   └── payment/          # Payment methods
├── ui/                    # UI component library
│   ├── atoms/            # Basic components (Button, Input, etc.)
│   ├── molecules/        # Composite components
│   └── organisms/        # Complex components (Forms, Charts, etc.)
├── components/           # Shared components (Navbar, etc.)
├── hooks/                # Custom React hooks
├── services/             # API client services
├── lib/                   # Library configurations
│   ├── auth.ts           # Auth utilities
│   ├── db.ts             # Database connection
│   ├── env.ts            # Environment validation
│   ├── jwt.ts            # JWT utilities
│   └── feature-flags.ts  # Feature flags
└── utils/                # Utility functions
```

### Module Pattern

Each feature module follows a consistent structure:

```
modules/[feature]/
├── [feature].controller.ts  # Request/response handling
├── [feature].service.ts      # Business logic
├── [feature].model.ts        # Mongoose models
├── [feature].schema.ts       # Zod validation schemas
└── [feature].types.ts        # TypeScript types
```

### API Design

- RESTful API routes under `/api`
- Server-side validation with Zod
- JWT authentication middleware
- Consistent error handling
- Type-safe request/response types

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- MongoDB database (local or Atlas)
- Resend account (optional, for emails)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/kanakkan.git
cd kanakkan
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL=mongodb://localhost:27017/kanakkan
# or
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/kanakkan

# JWT Secrets (generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Email (Optional)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME=Kanakkan
ENABLE_MONTHLY_SUMMARY_EMAIL=false

# App URL (Optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Seed the database (optional)**

```bash
npm run seed
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run seed` | Seed database with sample data |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Transactions
- `GET /api/expenses` - Get expenses
- `POST /api/expenses` - Create expense
- `GET /api/incomes` - Get incomes
- `POST /api/incomes` - Create income

### Categories
- `GET /api/categories` - Get categories
- `POST /api/categories` - Create category
- `GET /api/subcategories` - Get subcategories
- `POST /api/subcategories` - Create subcategory

### Dashboard
- `GET /api/dashboard/metrics` - Get all dashboard metrics
- `GET /api/dashboard/total-spend` - Get total spend
- `GET /api/dashboard/category-breakdown` - Get category breakdown
- `GET /api/dashboard/income-vs-expense` - Get income vs expense

### Email
- `POST /api/email/monthly-summary` - Send monthly summary email

### Cron Jobs
- `GET /api/cron/daily-reminder` - Send daily reminder emails to all users (runs automatically at 9PM CET via Vercel Cron)

## Configuration

### Environment Variables

All environment variables are validated at startup using Zod. See `.env.example` for required variables.

### TypeScript

- Strict mode enabled
- Additional strict rules configured
- Absolute imports with `@/` prefix

### Tailwind CSS

- Configured with CSS variables for theming
- Responsive design utilities
- Custom color palette

## Development

### Code Style

- Follow the project's `cursor_rules.md` for coding standards
- Use functional components with hooks
- Prefer named exports
- Keep files under 150 lines
- Use TypeScript interfaces over types
- Avoid `any` types

### Testing

```bash
# Run tests (when implemented)
npm test
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Transaction Form
![Transaction Form](docs/screenshots/transaction-form.png)

### Analytics
![Analytics](docs/screenshots/analytics.png)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)

## Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/yourusername/kanakkan/issues) page.
