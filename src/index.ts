import { server } from './server';
import { Database } from './database';

const run = async () => {
  try {
    await Database.connect();
    await Database.sync();

    // Start Express server
    server.listen(process.env.API_PORT || 8888, () => {
      console.log(`Server listening on port ${process.env.API_PORT || 8888}`);
    });
  } catch (error) {
    console.log(error);
  }
};

run();
