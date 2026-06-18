import http from 'http';
import { createApp } from './app.js';
import { config } from './config/index.js';
import { connectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';
import { initSocket } from './sockets/index.js';

const start = async () => {
  await connectDatabase();

  const app = createApp();
  const server = http.createServer(app);
  initSocket(server);

  server.listen(config.port, () => {
    logger.info(`API listening on port ${config.port}`);
  });
};

start().catch((error) => {
  logger.error('Failed to start API', { stack: error.stack });
  process.exit(1);
});
