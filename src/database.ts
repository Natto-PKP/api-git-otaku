import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

// Get all models
import { LogModel, UserModel } from './models/index';

dotenv.config(); // Load .env file

// Add all models to Sequelize
const models = [UserModel, LogModel];

// Create database connection
export const database = new Sequelize({
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  dialect: 'postgres',

  define: { underscored: true },
  logging: false,

  models,
});

// database.sync({ force: true }); // Create tables
// database.sync({ alter: true }); // Update tables
// database.drop({ cascade: true }); // Drop tables
