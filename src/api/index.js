/**
 *
 * init App
 *
 *
 */

// const authRoutes = require('../auth/router');
// const userRoutes = require('./users');
// const resetTokenRoutes = require('./resetTokens');
// const passwordResetRoutes = require('./passwordReset');
// const passwordChangeRoutes = require('./passwordChange');
const aylienRoutes = require('./aylien');
// const { getPassportAuthenticate } = require('../modules/authenticate');
//* __imports

const initializeApi = async (app, connectToDatabase) => {
  // eslint-disable-next-line no-console
  console.log('>>> initApi');

  // const connectDb = async (req, res, next) => {
  //   try {
  //     await connectToDatabase();
  //   } catch (error) {
  //     // eslint-disable-next-line no-console
  //     console.log('ERROR', { error });

  //     return res.send({ error });
  //   }
  //   next();
  // };

  // const authenticate = getPassportAuthenticate();

  app.get('/', (req, res) => {
    res.send('CODE HAS BEEN UPDATED');
  });

  //* __init

  aylienRoutes(app);
  // userRoutes(app, connectDb, authenticate);
  // resetTokenRoutes(app, connectDb, authenticate);
  // passwordResetRoutes(app, connectDb, authenticate);
  // passwordChangeRoutes(app, connectDb, authenticate);
};

exports.initializeApi = initializeApi;
