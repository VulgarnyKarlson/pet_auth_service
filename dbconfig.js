const dotenvFileType = typeof process.env.NODE_ENV === "undefined" ? "default" : process.env.NODE_ENV;
require('dotenv').config({ path: './.env.' + dotenvFileType });
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST;
const port = process.env.DATABASE_PORT;
const dbName = process.env.DATABASE_NAME;

const connectionString = `postgresql://${username}:${password}@${host}:${port}/${dbName}`;
module.exports = connectionString;
