import { database } from './src/database';

beforeAll(async () => {
  await database.sync({ force: true });
});
