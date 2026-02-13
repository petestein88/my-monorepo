# Sacred API

> Backend API for Sacred platform - handles authentication, device sessions, friends, and challenges.

## Status

This API is being migrated from the iot repository. The full source code needs to be copied from:

- **Source**: `petestein88/iot/src`
- **Destination**: This directory (`apps/api/src`)

## Migration Checklist

- [x] Package.json and configs
- [x] Server entry point
- [x] Environment template
- [ ] Copy all `/src` files from iot backend
- [ ] Update database connection
- [ ] Test all endpoints
- [ ] Deploy database migrations

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express
- **Database**: PostgreSQL + Knex.js
- **Auth**: JWT + Google OAuth
- **Email**: Nodemailer

## Database Setup

```bash
# Create PostgreSQL database
creatdb sacred_db

# Run migrations
npm run migrate

# Rollback if needed
npm run rollback
```

## Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your database credentials

# Run dev server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/google` - Google OAuth
- `POST /api/token/refresh` - Refresh JWT

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/stats` - Get user stats and streaks

### Charging Sessions (Device Events)
- `POST /api/charging-session` - Create session (from device)
- `GET /api/charging-session/user` - Get user's sessions

### Friends
- `POST /api/friend/request` - Send friend request
- `PUT /api/friend/accept` - Accept request
- `GET /api/friend/list` - Get friends
- `GET /api/friend/requests` - Get pending requests

## Environment Variables

See `.env.example` for all required environment variables.
