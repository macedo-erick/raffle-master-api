import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  const { JWT_SECRET, JWT_EXPIRES } = process.env;

  return {
    secret: JWT_SECRET,
    expires: JWT_EXPIRES
  };
});
