// Placeholder - will be replaced with full router from iot backend
import express from 'express';

const router = express.Router();

// TODO: Import and mount all routers:
// - authRouter
// - userRouter
// - chargingSessionRouter
// - friendRouter
// - tokenRouter

router.get('/', (req, res) => {
  res.json({ message: 'Sacred API v1', status: 'ok' });
});

export default router;
