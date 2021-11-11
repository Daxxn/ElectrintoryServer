var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
// const env = require('dotenv').config();

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    // jwksUri: env.parsed.AUTH_JWT_URI ?? process.env.AUTH_JWT_URI,
    jwksUri: 'https://dev-6ryc0ksm.us.auth0.com/.well-known/jwks.json',
  }),
  audience: env.parsed.AUTH_AUDIENCE ?? process.env.AUTH_AUDIENCE,
  issuer: env.parsed.AUTH_ISSUER ?? process.env.AUTH_ISSUER,
  algorithms: ['RS256'],
});

module.exports = jwtCheck;
