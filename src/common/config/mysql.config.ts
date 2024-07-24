import { registerAs } from '@nestjs/config';

export default registerAs('mysql', () => {
  const { DB_PORT, DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;
  return {
    dbHost: DB_HOST,
    dbPort: DB_PORT,
    dbName: DB_NAME,
    dbUsername: DB_USERNAME,
    dbPassword: DB_PASSWORD
  };
});
