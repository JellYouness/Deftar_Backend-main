# Migration Guide: MySQL to PostgreSQL

This guide will help you migrate your Deftre Backend from MySQL to PostgreSQL.

## Prerequisites

1. Install PostgreSQL on your system
2. Create a new PostgreSQL database
3. Install the new dependencies

## Step 1: Install Dependencies

```bash
npm install
```

This will install the `pg` package and remove `mysql2`.

## Step 2: Set Up PostgreSQL Database

1. Create a new PostgreSQL database:

```sql
CREATE DATABASE deftre;
```

2. Import the PostgreSQL schema:

```bash
psql -d deftre -f deftre_postgresql.sql
```

## Step 3: Configure Environment Variables

Create a `.env` file with your PostgreSQL connection:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/deftre
PORT=5000
HOST=172.17.139.87
NODE_ENV=development
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

## Step 4: Test the Connection

Start the server:

```bash
npm start
```

You should see: "✅ Connecté à PostgreSQL"

## Key Changes Made

### Database Connection

- **Before**: MySQL connection with hardcoded credentials
- **After**: PostgreSQL connection pool using environment variables

### Query Syntax

- **Before**: `?` placeholders
- **After**: `$1, $2, ...` placeholders

### Query Results

- **Before**: `results[0]`, `result.insertId`
- **After**: `result.rows[0]`, `result.rows[0].id`

### Connection Management

- **Before**: Callback-based queries
- **After**: Async/await with connection pooling

## Troubleshooting

### Common Issues

1. **Connection Error**: Check your `DATABASE_URL` format
2. **SSL Error**: Add `?sslmode=require` to your DATABASE_URL for production
3. **Schema Error**: Make sure you've imported the PostgreSQL schema

### SSL Configuration

For production environments, you may need SSL:

```env
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

## Data Migration

If you have existing data in MySQL:

1. Export your MySQL data:

```bash
mysqldump -u username -p deftre > mysql_backup.sql
```

2. Convert the data format (you may need to adjust date formats and other MySQL-specific syntax)

3. Import to PostgreSQL:

```bash
psql -d deftre -f converted_data.sql
```

## Verification

Test your endpoints to ensure everything works:

- `/api/health` - Health check
- `/api/login` - Login functionality
- `/api/contact` - Contact form
- `/api/orders` - Order management

## Rollback Plan

If you need to rollback to MySQL:

1. Revert the code changes
2. Install mysql2: `npm install mysql2`
3. Update your `.env` file with MySQL credentials
4. Restore your MySQL database
