import dotenv from 'dotenv';

dotenv.config();

type Env = 'development' | 'test' | 'production';
export const env = (process.env.NODE_ENV || 'development') as Env;

export const environments = {
  development: {
    database: {
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE + '--dev',
    },
  },
  test: {
    database: {
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE + '--test',
    },
  },
  production: {
    database: {
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
    },
  },
};

export const environment = environments[env];
