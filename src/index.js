// #region Imports
const env = require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const debug = require('morgan');
const cors = require('cors');
const http = require('http');
// const session = require('express-session');
// const MongoSession = require('connect-mongo');
// const userModel = require('./models/users');
// const { messageHelper, messages } = require('./utils/messageHelper');

const authCheck = require('./utils/authMiddleware/auth0');
const Config = require('./utils/config');

const errorCallback = (err) => {
  if (err) {
    if (process.env.DEBUG) {
      console.log(err);
    }
  }
};

// #region Routes
const userRoute = require('./routes/user');
const partsRoute = require('./routes/part');
const packageRoute = require('./routes/package');
// #endregion

// #endregion

// #region Test Route
const homeRoute = (app) => {
  app.get('/', (req, res, next) => {
    res.status(200).json({
      message: 'Home',
    });
  });
};
// #endregion

// #region Build Routes
/**
 * Build API routes
 * @param {express} app Express App
 * @param {Config} config Config Object
 * @param {mongoose} db Mongoose Database
 */
const apiRoutes = (app, config, db) => {
  const apiRouter = express.Router();
  // Auth Init
  apiRouter.use(authCheck);
  apiRouter.use('/user', userRoute());
  apiRouter.use('/parts', partsRoute());
  apiRouter.use('/packages', packageRoute());
  app.use('/api', apiRouter);
};
// #endregion

// #region Middleware
/**
 * Initialize all necessary middleware.
 * @param {express} app Express App
 * @param {Config} config Config object
 */
const initMiddleware = (app, config) => {
  app.use(
    cors({
      origin: [config.client],
      exposedHeaders: ['Access-Control-Allow-Origin', 'Content-Type'],
      allowedHeaders: [
        'Access-Control-Allow-Origin',
        'Content-Type',
        'Authorization',
      ],
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));
  if (config.debug) {
    app.use(debug('dev'));
  }
};
// #endregion

// #region Error Handling
const initErrorHandler = (app, config) => {
  app.use((err, req, res, next) => {
    if (config.debug) {
      res.locals.mesage = err.message;
      res.locals.err = err;
      console.log(err);
    }
    res.status(err.status || 500).json(err);
  });
};
// #endregion

// #region Session Init
// TODO - Get express session working securely.
// const initSession = (app) => {
//   app.use(
//     session({
//       secret: process.env.SECRET,
//       store: MongoSession.create({
//         mongoUrl: process.env.DB_CONNECT,
//       }),
//       cookie: {
//         secure: false,
//         maxAge: 6000000,
//       },
//       resave: true,
//       saveUninitialized: true,
//     })
//   );
// };
// #endregion

// #region Database
const databaseConnection = (app, config, callback) => {
  const db = mongoose.connect(config.dbConnect, {}, callback);
  apiRoutes(app, db);
  return db;
};
// #endregion

// #region Startup
const startExpress = (config) => {
  const app = express();
  initMiddleware(app, config);
  // initSession(app);
  homeRoute(app);
  initErrorHandler(app);
  return app;
};

const start = () => {
  const config = Config.build(errorCallback);
  const app = startExpress(config);
  const server = http.createServer(app);
  databaseConnection(app, config, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to database');
      server.listen(config.port, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Started Server  @  ${JSON.stringify(server.address())}`);
        }
      });
    }
  });
  return app;
};
// #endregion

module.exports = start();
