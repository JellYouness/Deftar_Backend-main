# Deftre Backend

A Node.js backend application using Express and PostgreSQL.

## Setup

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/deftre

# Server Configuration
PORT=5000
HOST=172.17.139.87

# Environment
NODE_ENV=development
```

3. Set up your PostgreSQL database:

   - Create a database named `deftre`
   - Import the PostgreSQL schema from `deftre_postgresql.sql`
   - Or use the original `deftre.sql` and convert MySQL syntax to PostgreSQL manually

4. Start the server:

```bash
npm start
```

## Database Migration from MySQL to PostgreSQL

This project has been migrated from MySQL to PostgreSQL. Key changes:

- Replaced `mysql2` with `pg` (PostgreSQL client)
- Updated query syntax from `?` placeholders to `$1, $2, ...` placeholders
- Changed from callback-based queries to async/await with connection pooling
- Added SSL configuration for production environments

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/deftre

# Server Configuration
PORT=5000
HOST=172.17.139.87

# Environment
NODE_ENV=development

# Email Configuration (for nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Other optional variables
# STRIPE_SECRET_KEY=your_stripe_secret_key
```

### DATABASE_URL Format

The `DATABASE_URL` should follow this format:

- Local: `postgresql://username:password@localhost:5432/deftre`
- Remote: `postgresql://username:password@host:port/database`
- With SSL: `postgresql://username:password@host:port/database?sslmode=require`

## API Endpoints

- `/api/health` - Health check
- `/api/*` - Various API routes
- `/banks/*` - Bank-related routes
