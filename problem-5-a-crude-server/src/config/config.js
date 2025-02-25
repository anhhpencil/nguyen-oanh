const path = require('path');

const dotenv = require('dotenv');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().required(),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required(),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().required(),
    SYSTEM_SECRET: Joi.string().required().description("System secret"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  port: envVars.PORT || 5000,

  mongoose: {
    url: envVars.MONGODB_URL,
    options: {},
  },
  system: {
    secret: envVars.SYSTEM_SECRET,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiration: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  },
};
