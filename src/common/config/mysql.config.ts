import { registerAs } from '@nestjs/config';

export default registerAs('mysql', () => {
  const { DB_PORT, DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;
  return {
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD
  };
});
