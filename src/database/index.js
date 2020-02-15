import Sequelize from 'sequelize';

import User from '../app/models/User';

import databaseConfig from '../config/database';

// array com todos os models para usar na app
const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    // percorrer todos os models
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
