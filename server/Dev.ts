// True for development, False for deployment
export const DEV = true;

// True to create / reset EVERYTHING. Turn it off after you run it once!
export const RESET_DATABASE = false;

// True to reset the posts table.
export const RESET_POSTS = false;

// True to reset the accounts table.
export const RESET_ACCOUNTS = false;

// DB connection info 
export const DB_CONFIG = {
    host: "localhost",
    port: 5432,
    database: "furryslop",
    username: "postgres",
    password: "101098"
}