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
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
};

export const mailer = {
  EMAIL: process.env.EMAIL,
  ID: process.env.MAIL_ID,
  SECRET: process.env.MAIL_SECRET,
  REFRESH_TOKEN: process.env.MAIL_REFRESH,
};

export const cloudinary = {
  NAME: process.env.CLOUDINARY_NAME,
  KEY: process.env.CLOUDINARY_KEY,
  SECRET: process.env.CLOUDINARY_SECRET,
};
