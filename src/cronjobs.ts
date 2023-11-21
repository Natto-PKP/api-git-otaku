/* istanbul ignore file */

import { CronJob } from 'cron';
import { UserSanctionService } from './routes/users/sanctions/UserSanctionService';
import { LogModel } from './models';

export const canRun = process.env.NODE_ENV !== 'test';

export const run = (ok = canRun) => {
  if (!ok) return;

  const CronJobEveryMinute = new CronJob(
    '0 */1 * * * *',
    async () => {
      try {
        await UserSanctionService.finishAllWhoExpired();
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          await LogModel.create({
            type: 'ERROR',
            message: error.message,
            data: error.stack,
          });
        } else console.error(error);
      }
    },
    null,
    true,
    'Asia/Jakarta',
  );

  return { CronJobEveryMinute };
};

export default run();
