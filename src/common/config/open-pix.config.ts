import { registerAs } from '@nestjs/config';

export default registerAs('openPix', () => {
  const { OPEN_PIX_URL, OPEN_PIX_APP_ID } = process.env;

  return {
    url: OPEN_PIX_URL,
    appId: OPEN_PIX_APP_ID
  };
});
