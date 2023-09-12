import Joi from 'joi';

const validation = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  COOKIE_SECRET: Joi.string(),
  PORT: Joi.number().default(3000),
  DB_PORT: Joi.number().default(5432),
  DB_HOST: Joi.string().default('postgres'),
  DB_USER: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default('changeme'),
  PG_DB: Joi.string().default('goodmarks'),
  WEAVIATE_URI: Joi.string().default('weaviate'),
  WEAVIATE_PORT: Joi.number().default(8080),
});

export default validation;
