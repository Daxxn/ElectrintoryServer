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
// const oldAuthCheck = require('./utils/authMiddleware/oldAuth');

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
const apiRoutes = (app, db) => {
  const apiRouter = express.Router();
  // Auth Init
  if (env.parsed.AUTH0 ?? process.env.AUTH0 === 'true') {
    apiRouter.use(authCheck);
  }
  apiRouter.use('/user', userRoute());
  apiRouter.use('/parts', partsRoute());
  apiRouter.use('/packages', packageRoute());
  app.use('/api', apiRouter);
};
// #endregion

// #region Middleware
const initMiddleware = (app) => {
  app.use(
    cors({
      origin: [env.parsed.CLIENT ?? process.env.CLIENT],
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
  if (env.parsed.DEBUG ?? process.env.DEBUG) {
    app.use(debug('dev'));
  }
};
// #endregion

// #region Error Handling
const initErrorHandler = (app) => {
  app.use((err, req, res, next) => {
    if (env.parsed.DEBUG ?? process.env.DEBUG) {
      res.locals.mesage = err.message;
      res.locals.err = err;
      console.log(err);
    }
    res.status(err.status || 500).json(err);
  });
};
// #endregion

// #region Session Init
// const initSession = (app) => {
//   app.use(
//     session({
//       secret: env.parsed.SECRET ?? process.env.SECRET,
//       store: MongoSession.create({
//         mongoUrl: env.parsed.DB_CONNECT ?? process.env.DB_CONNECT,
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
const databaseConnection = (app, callback) => {
  const db = mongoose.connect(
    env.parsed.DB_CONNECT ?? process.env.DB_CONNECT,
    {},
    callback
  );
  apiRoutes(app, db);
  return db;
};
// #endregion

// #region Startup
const startExpress = () => {
  const app = express();
  initMiddleware(app);
  // initSession(app);
  homeRoute(app);
  initErrorHandler(app);
  return app;
};

const start = () => {
  const app = startExpress();
  const server = http.createServer(app);
  databaseConnection(app, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to database');
      server.listen(env.parsed.PORT ?? process.env.PORT, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Started Server : ${env.parsed.PORT ?? process.env.PORT}`);
        }
      });
    }
  });
  return app;
};
// #endregion

module.exports = start();
