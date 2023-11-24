import { Database } from './src/database';

beforeAll(async () => {
  await Database.connect();
});

afterAll(async () => {
  await Database.truncate();
  await Database.disconnect();
});
