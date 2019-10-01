/* eslint-disable prefer-destructuring */

require('dotenv').config();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  global.DATABASE_URL ||
  'mongodb://localhost/droned-db';
const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || 'mongodb://localhost/droned-test-db';
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_PASSWORD_RESET_EXPIRY =
  process.env.JWT_PASSWORD_RESET_EXPIRY || '30m';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

const DATABASE_URI_DEV = process.env.DATABASE_URI_DEV;
const DATABASE_URI_PROD = process.env.DATABASE_URI_PROD;
const NODE_ENV = process.env.NODE_ENV;

const AYLIEN_API_ID = process.env.AYLIEN_API_ID;
const AYLIEN_API_KEY = process.env.AYLIEN_API_KEY;

const use_db = process.env.use_db;

module.exports = {
  DATABASE_URL,
  TEST_DATABASE_URL,
  PORT,
  JWT_SECRET,
  JWT_EXPIRY,
  JWT_PASSWORD_RESET_EXPIRY,
  DATABASE_URI_DEV,
  DATABASE_URI_PROD,
  NODE_ENV,
  use_db,
  AYLIEN_API_ID,
  AYLIEN_API_KEY,
};
