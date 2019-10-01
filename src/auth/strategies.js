/**
 *
 * Auth Strategies
 *
 *
 */

const { BasicStrategy } = require('passport-http');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const User = require('../models/user');
const { JWT_SECRET } = require('../config');

const basicStrategy = new BasicStrategy((username, password, fn) => {
  // Check which field user is singing in with
  const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(username);
  const identifierField = isEmail ? 'email' : 'username';
  let user;
  User.findOne({ [identifierField]: username })
    .then(_user => {
      user = _user;
      if (!user) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: `Incorrect ${identifierField} or password`,
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: `Incorrect ${identifierField} or password`,
        });
      }
      return fn(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return fn(null, false, err);
      }
      return fn(err, false);
    });
});

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256'],
  },
  (payload, done) => {
    done(null, payload.user);
  },
);

module.exports = {
  basicStrategy,
  jwtStrategy,
};
