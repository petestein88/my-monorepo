# Sacred Dashboard App

> User dashboard for tracking phone-free time, streaks, challenges, and friends.

## Status

This app is being migrated from the iot-frontend repository. The full source code needs to be copied from:

- **Source**: `petestein88/iot-frontend`
- **Destination**: This directory (`apps/app/src`)

## Migration Checklist

- [x] Package.json and configs
- [x] Entry point (main.tsx)
- [x] Dark mode base styles
- [ ] Copy all `/src` files from iot-frontend
- [ ] Update all "manu-mission" → "sacred"
- [ ] Apply dark mode design tokens
- [ ] Update API base URLs in config
- [ ] Test all pages

## Quick Start

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Dark Mode Design Tokens

- Background: `bg-sacred-black` (#000000)
- Text: `text-sacred-white` (#FFFFFF)
- Cards/Sections: `bg-sacred-gray` (#1A1A1A)
- Borders: `border-sacred-white/10`
