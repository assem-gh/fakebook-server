import dotenv from 'dotenv';

dotenv.config();

export const db = {
  NAME: process.env.DB_NAME || 'postgres',
  HOST: process.env.DB_HOST || 'localhost',
  USERNAME: process.env.DB_USERNAME || 'postgres',
  PASSWORD: process.env.DB_PASSWORD || '123456',
  PORT: Number(process.env.DB_PORT) || 5432,
};

export const server = {
  PORT: process.env.PORT || '5000',
  JWT_SECRET: process.env.JWT_SECRET || 'S$E#cRe?T',
};
