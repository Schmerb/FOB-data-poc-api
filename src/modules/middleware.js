/**
 *
 * Middleware
 *
 *
 */

const mongoose = require('mongoose');
const morgan = require('morgan');
// const passport = require('passport');
const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');

// const { init } = require('./authenticate');
// const { basicStrategy, jwtStrategy } = require('../auth/strategies');

const isProduction = process.env.NODE_ENV === 'production';

// CONFIG
mongoose.Promise = global.Promise;

const bindMiddleware = router => {
  router.use(morgan(isProduction ? 'tiny' : 'common'));
  // router.use(responseTime());
  // router.use(compression());
  // router.use(helmet());

  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    );
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // MIDDLEWARE
  // router.use(passport.initialize());
  // passport.use(basicStrategy);
  // passport.use(jwtStrategy);
  // init(passport);

  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(busboyBodyParser({ limit: '10mb' })); // required for gridFS file store

  return router;
};

exports.bindMiddleware = bindMiddleware;
