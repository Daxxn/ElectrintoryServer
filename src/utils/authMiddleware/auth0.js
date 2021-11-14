var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

const config = require('../config').get();

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: config.jwt,
  }),
  audience: config.audience,
  issuer: config.issuer,
  algorithms: ['RS256'],
});

module.exports = jwtCheck;
