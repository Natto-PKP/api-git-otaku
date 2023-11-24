import { Sequelize } from 'sequelize-typescript';
import { environment } from './config';

import { ApiLogModel, UserModel, UserSanctionCommentModel, UserSanctionModel } from './models/index';

// Create connection
const connection = new Sequelize({
  username: environment.database.username,
  password: environment.database.password,
  database: environment.database.database,
  dialect: 'postgres',

  define: { underscored: true },
  logging: false,

  models: [UserModel, ApiLogModel, UserSanctionModel, UserSanctionCommentModel],
});

export class Database {
  static connection = connection;

  static async connect() {
    await connection.authenticate();
  }

  static async disconnect() {
    await connection.close();
  }

  static async reset() {
    await Database.drop();
    await Database.create();
  }

  static async sync() {
    await connection.sync({ alter: true });
  }

  static async drop() {
    await connection.drop({ cascade: true });
  }

  static async create() {
    await connection.sync({ force: true });
  }

  static async truncate() {
    await connection.truncate({ cascade: true, restartIdentity: true });
  }
}
