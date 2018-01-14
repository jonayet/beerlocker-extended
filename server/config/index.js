const { developmentConfig } = require('./development');

const env = process.env.NODE_ENV || 'development';
let config;

switch (env) {
  case 'development':
    config = developmentConfig;
    break;
  default:
    config = developmentConfig;
}

exports.config = config;
