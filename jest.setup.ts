import { Database } from './src/database';

beforeAll(async () => {
  await Database.connect();
});

afterEach(async () => {
  await Database.truncate();
});

afterAll(async () => {
  await Database.disconnect();
});
