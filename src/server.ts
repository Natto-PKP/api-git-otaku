import Express from 'express';
import { router } from './routes/router';

import './database'; // Connect to database
import './cronjobs'; // Start cronjobs

// Create Express server
export const server = Express();

// Express configuration
server.use(router);
