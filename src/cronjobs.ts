/* istanbul ignore file */

// import { CronJob } from 'cron';
// import { UserSanctionService } from './routes/users/sanctions/UserSanctionService';
// import { ApiLogService } from './routes/api/logs/ApiLogService';

export const canRun = process.env.NODE_ENV !== 'test';

export const run = (ok = canRun) => {
  if (!ok) return;
};

export default run();
