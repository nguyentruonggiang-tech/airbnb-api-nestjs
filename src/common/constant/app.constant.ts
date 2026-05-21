import 'dotenv/config';

export const PORT = process.env.PORT;

export const DATABASE_URL = process.env.DATABASE_URL;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_EXPIRES_IN = process.env.ACCESS_EXPIRES_IN ?? '1d';

export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN ?? '7d';