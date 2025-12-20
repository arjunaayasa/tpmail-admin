# Temp Mail Backend

NestJS REST API for temporary email service.

Project for ArvoreCloud. Proudly made by PT Arsya Digital Indonesia.

## Tech Stack

- NestJS 11
- Prisma ORM
- PostgreSQL
- JWT Authentication
- imapflow (IMAP client)

## Installation

```bash
npm install
```

## Configuration

Create `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mail2?schema=public"
JWT_SECRET="your-jwt-secret"

# Optional: Default domain seeding
DEFAULT_DOMAIN="yourdomain.com"
IMAP_HOST="mail.yourdomain.com"
IMAP_PORT="993"
IMAP_USER="catchall@yourdomain.com"
IMAP_PASSWORD="yourpassword"
```

## Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Seed default admin and API key
npx prisma db seed
```

## Running

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

Server runs at: http://localhost:3000

## API Documentation

Visit http://localhost:3000/api/docs for full API reference.

## Project Structure

```
src/
├── admin/           # Admin module (auth, domains, api-keys)
├── auth/            # API key guard
├── domains/         # Domain management
├── emails/          # Email generation
├── imap/            # IMAP service
├── messages/        # Message retrieval
├── prisma/          # Database service
├── scheduler/       # Cleanup cron jobs
├── app.controller.ts # Landing page & docs
├── app.module.ts
└── main.ts
```

## Database Schema

### Models
- Domain - Email domains with IMAP config
- Email - Generated temporary email addresses
- Message - Received email messages
- Admin - Admin users
- ApiKey - API keys for authentication

## API Endpoints

### Public Endpoints (X-API-KEY header)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/emails/generate | Generate temp email |
| GET | /api/emails/:email/messages | Get messages |

### Admin Endpoints (JWT Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/admin/login | Admin login |
| GET | /api/admin/stats | Get statistics |
| GET | /api/admin/domains | List domains |
| POST | /api/admin/domains | Create domain |
| PATCH | /api/admin/domains/:id | Update domain |
| DELETE | /api/admin/domains/:id | Delete domain |
| GET | /api/admin/api-keys | List API keys |
| POST | /api/admin/api-keys | Create API key |
| DELETE | /api/admin/api-keys/:id | Revoke API key |
| POST | /api/admin/imap/test | Test IMAP connection |

## Default Credentials

After running seed:
- Admin: admin@example.com / admin123
- API Key: Check console output or database

## License

MIT
