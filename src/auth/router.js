/**
 *
 * Auth Router
 *
 *
 */

const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config');

const createAuthToken = user => {
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256',
  });
};

// exports.router = router;

function authRouter(router, connectDb) {
  router.post(
    '/api/auth/login',
    connectDb,
    // The user provides a username and password to login
    passport.authenticate('basic', { session: false }),
    (req, res) => {
      const authToken = createAuthToken(req.user.apiRepr());
      res.json({ authToken });
    },
  );

  router.post(
    '/api/auth/refresh',
    connectDb,
    // The user exchanges an existing valid JWT for a new one with a later
    // expiration
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const authToken = createAuthToken(req.user);
      console.log('Token refreshed for: ', req.user);
      res.json({ authToken });
    },
  );
}

module.exports = authRouter;
