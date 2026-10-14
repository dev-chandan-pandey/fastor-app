import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
async function start() {
  if (!env.jwtSecret) throw new Error('JWT_SECRET is required. Copy .env.example to .env and configure it.');
  await connectDatabase();
  const server = app.listen(env.port, () => console.log(`Fastor API listening on http://localhost:${env.port}`));
  const shutdown = signal => { console.log(`${signal} received; shutting down`); server.close(() => process.exit(0)); };
  process.on('SIGTERM', () => shutdown('SIGTERM')); process.on('SIGINT', () => shutdown('SIGINT'));
}
start().catch(err => { console.error('Failed to start API:', err.message); process.exit(1); });
