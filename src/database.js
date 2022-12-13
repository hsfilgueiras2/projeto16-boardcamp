import pkg from 'pg';
import * as dotenv from 'dotenv'
dotenv.config()

const { Pool } = pkg;

export const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
});