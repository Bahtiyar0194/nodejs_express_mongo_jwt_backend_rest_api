const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  PORT: process.env.PORT || 4000,
  JWT_KEY: process.env.SECRET_KEY
};