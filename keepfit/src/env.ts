import * as dotenv from 'dotenv';
import populateEnv from 'populate-env';

dotenv.config();

export let env = {
  DB_NAME: '',
  DB_USERNAME: '',
  DB_PASSWORD: '',
  NODE_ENV: '',
  FRONTEND_ORIGIN: '',
  EMAIL_ADDRESS: '',
  EMAIL_PASSWORD: '',
};

populateEnv(env, { mode: 'halt' });
