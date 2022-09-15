import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config()

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
} = process.env;

const db = new Sequelize(
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  {
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: 'postgres',
    logging: false,
    // models: Object.values(models),
    dialectOptions: {
      decimalNumbers: true
    },
    pool: {
      min: 0,
      max: 2,
      idle: 0,
      acquire: 3000,
      evict: 6000
    },
  },
);

export default db