# Deftar Backend API - Next.js

This is a Next.js API backend for the Deftar application, built for deployment on Vercel.

## Features

- 🔐 User authentication and management
- 📞 Contact form handling
- 📦 Order management with file uploads
- 📧 Email sending functionality
- 📊 Dashboard statistics
- 🏦 Bank management
- 🖼️ Model image management
- 📁 File upload and serving

## API Endpoints

### Authentication

- `POST /api/login` - User login
- `POST /api/add-account` - Add new user account
- `POST /api/update-account` - Update user account

### Contact

- `GET /api/contact` - Get all contact messages
- `POST /api/contact` - Create new contact message
- `PUT /api/contact/[id]/reply` - Reply to contact message

### Orders

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order (with file uploads)

### Email

- `POST /api/send-mail` - Send email with attachments

### Dashboard

- `GET /api/dash/status` - Get order status statistics
- `GET /api/dash/matiere` - Get subject statistics

### Banks

- `GET /api/banks` - Get all banks
- `POST /api/banks` - Add new bank
- `PUT /api/banks/[id]` - Update bank
- `DELETE /api/banks/[id]` - Delete bank

### Models

- `GET /api/models` - Get all model images
- `POST /api/models` - Add new model image
- `DELETE /api/models/[id]` - Delete model image

### Files

- `GET /api/uploads/[...path]` - Serve uploaded files

### System

- `GET /api/health` - Health check
- `POST /api/init` - Initialize database

## Environment Variables

Create a `.env.local` file with the following variables:

```env
DATABASE_URL=your_postgresql_connection_string
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables in `.env.local`

3. Run the development server:

```bash
npm run dev
```

4. Initialize the database (optional):

```bash
curl -X POST http://localhost:3000/api/init
```

## Deployment to Vercel

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy to Vercel:

```bash
vercel
```

3. Set environment variables in Vercel dashboard:

   - Go to your project settings
   - Add the environment variables (DATABASE_URL, EMAIL_USER, EMAIL_PASS)

4. Initialize the database after deployment:

```bash
curl -X POST https://your-vercel-app.vercel.app/api/init
```

## File Uploads

The application handles file uploads for:

- Order receipts (PDF)
- Schedule images (JPG, PNG, WebP)
- Bank logos (JPG, PNG)
- Model images (JPG, PNG, WebP)

Files are stored in the `uploads/` directory and served via the `/api/uploads/[...path]` endpoint.

## Database Schema

The application expects the following PostgreSQL tables:

- `users` - User accounts
- `contact` - Contact messages
- `commandes` - Orders
- `banks` - Bank information
- `models_images` - Model images

## CORS Configuration

The API is configured to allow requests from any origin (`*`) for development. In production, you should configure specific origins in the middleware.

## Notes

- The application uses PostgreSQL as the database
- File uploads are handled using FormData
- Email functionality uses Nodemailer with Gmail SMTP
- All API responses are in JSON format
- Error handling includes appropriate HTTP status codes

## Architecture

This Next.js application is built with the following architecture:

- API routes are located in the `app/api/` directory
- File uploads use FormData for handling multipart data
- Database queries use PostgreSQL syntax
- CORS is handled via middleware
- Static file serving is handled via API routes
