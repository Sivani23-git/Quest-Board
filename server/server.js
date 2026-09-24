import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { seedDatabase } from './src/config/seed.js';
import { startPistonServer } from './src/piston-service/index.js';

const PORT = process.env.PORT || 5000;
const PISTON_PORT = process.env.PISTON_PORT || 2000;

async function startServer() {
  await connectDB();
  await seedDatabase();

  try {
    await startPistonServer(PISTON_PORT);
  } catch (err) {
    if (err.code === 'EADDRINUSE') {
      console.log(`[Piston Engine] Port ${PISTON_PORT} already active (using existing Piston / Docker container)`);
    } else {
      console.warn(`[Piston Engine] Note on port ${PISTON_PORT}:`, err.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`⚔️ QuestBoard Server active on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api/v1`);
    console.log(`⚡ Piston Execution API: http://localhost:${PISTON_PORT}/api/v2`);
  });
}

startServer();
