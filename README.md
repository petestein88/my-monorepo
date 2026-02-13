# Sacred Monorepo

> Reclaim what matters. One phone-free moment at a time.

## Project Structure

```
sacred-monorepo/
├── apps/
│   ├── web/          # Marketing site (sacred.systems landing + about)
│   ├── app/          # Dashboard (user platform)
│   └── api/          # Backend API
├── packages/
│   ├── ui/           # Shared design system
│   └── config/       # Shared configurations
└── package.json      # Root workspace config
```

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + TypeScript + Express + Knex + PostgreSQL
- **Deployment**: Netlify (frontend) + your preferred backend host

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL (for local API development)

### Installation

```bash
# Install all dependencies
npm install

# Run marketing site locally
npm run dev:web

# Run dashboard locally
npm run dev:app

# Run API locally
npm run dev:api
```

### Build for Production

```bash
# Build all apps
npm run build:all

# Or build individually
npm run build:web   # Marketing site
npm run build:app   # Dashboard
npm run build:api   # Backend API
```

## Deployment

### Netlify Setup

**Site 1: Marketing (sacred.systems)**
- Base directory: `apps/web`
- Build command: `npm run build`
- Publish directory: `apps/web/dist`

**Site 2: Dashboard (sacred.systems/app)**
- Base directory: `apps/app`
- Build command: `npm run build`
- Publish directory: `apps/app/dist`
- Redirects: Configure `/app/*` to point to this deployment

## Development Guidelines

- All components use the shared design system from `packages/ui`
- Dark mode by default (black backgrounds, white text)
- Mobile-first responsive design
- TypeScript strict mode enabled

## License

Private - All Rights Reserved
