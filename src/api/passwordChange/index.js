/**
 * PasswordChange Router
 *
 *
 */

const bodyParser = require('body-parser');

const passwordChange = require('./controller');

const jsonParser = bodyParser.json();

function passwordChangeRoutes(router, connectDb, authenticate) {
  /**
   * Post PasswordChanges
   *
   *
   */
  router.put(
    '/api/password-change',
    connectDb,
    jsonParser,
    authenticate,
    async (req, res) => {
      console.log({ passwordChangeController: passwordChange });
      return passwordChange
        .changePassword(req.user, req.body)
        .then(data => {
          return res.status(200).json(data); // 200 OK
        })
        .catch(err => {
          if (err.reason === 'ValidationError') {
            return res.status(err.code).json(err);
          }
          return res.send(err.code || 500).send(err);
        });
    },
  );

  // how to secure this endpoint
  // from random requests
  router.put(
    '/api/password-change/from-reset',
    connectDb,
    jsonParser,
    async (req, res) => {
      return passwordChange
        .changePasswordFromReset(req.body)
        .then(data => {
          return res.status(200).json(data); // 200 OK
        })
        .catch(err => {
          if (err.reason === 'ValidationError') {
            return res.status(err.code).json(err);
          }
          return res.send(err.code || 500).send(err);
        });
    },
  );
}

module.exports = passwordChangeRoutes;
