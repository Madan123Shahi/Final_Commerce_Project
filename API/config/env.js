import { cleanEnv, str, port, num, bool, url } from "envalid";

const env = cleanEnv(process.env, {
  MONGO_URI: url(),
  PORT: port({ default: 8000 }),
  JWT_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  CLIENT_URL: str(),
  NODE_ENV: str({ choices: ["development", "production"] }),
});

export default env;
