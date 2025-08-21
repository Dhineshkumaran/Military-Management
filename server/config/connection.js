import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const {
POSTGRES_HOST,
POSTGRES_DB,
POSTGRES_USER,
POSTGRES_PASSWORD
} = process.env;

// const Client = new Pool({
//     host: POSTGRES_HOST,
//     database: POSTGRES_DB,
//     user: POSTGRES_USER,
//     password: POSTGRES_PASSWORD
// });

const Client = new Pool({
  connectionString: `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}/${POSTGRES_DB}`,
  ssl: {
    rejectUnauthorized: false
  }
});

export default Client;