/**
 *
 * Authentication via Passport
 *
 *
 */

let auth;

const init = passport => {
  auth = passport.authenticate('jwt', { session: false });
  // console.log('insider service', auth);
};

const getPassportAuthenticate = () => auth;

module.exports = {
  init,
  getPassportAuthenticate,
};
