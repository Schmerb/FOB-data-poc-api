/**
 * Password Reset (Recovery) Router
 *
 *
 */

const bodyParser = require('body-parser');
const useragent = require('express-useragent');

const passwordReset = require('./controller');

// "The useragent library allows you do use the automatically
// installed RegExp library or you can fetch it live from the
// remote servers. So if you are paranoid and always want your
// RegExp library to be up to date to match with agent the
// widest range of useragent strings you can do"
// useragent(true);
const jsonParser = bodyParser.json();

function passwordResetRoutes(router, connectDb) {
  /**
   * List users
   */
  router.post(
    '/api/password-reset',
    connectDb,
    jsonParser,
    async (req, res) => {
      console.log({ req });
      const { body, ip } = req;
      return passwordReset
        .validate(body)
        .then(async email => {
          // request was valid, we dont want to return whether or not
          // email exists for security purposes, we will provide
          // results in actual email sent

          const source = req.headers['user-agent'];
          const ipXForwardedFor = req.headers['x-forwarded-for'];
          console.log({ ip });
          console.log({ ipXForwardedFor });
          const ipAddress = ip || ipXForwardedFor;
          const agent = useragent.parse(source);
          console.log({ agent });
          const { browser, os, platform } = agent;
          // initiate password reset flow
          const url = await passwordReset.initiate(email, {
            ipAddress,
            browser,
            platform,
            operatingSystem: os,
          });

          // fail silently to avoid malicious attempts
          return res.status(200).json({ url }); // 200 OK, let user know request was valid
        })
        .catch(err => {
          console.log({ ERROR: err });
          if (err.reason === 'ValidationError') {
            return res.status(err.code).json(err);
          }
          return res.send(err);
        });
    },
  );
}

module.exports = passwordResetRoutes;
