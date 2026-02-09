# IoT Backend

Backend service for IoT device management and data collection.

## Getting Started

```bash
npm install
npm start
```

The server runs on port 3000 by default. Set the `PORT` environment variable to change it.

## API Endpoints

- `GET /api/health` — Health check
- `GET /api/devices` — List all registered devices
- `POST /api/devices` — Register a new device (JSON body)

## Running Tests

```bash
npm test
```