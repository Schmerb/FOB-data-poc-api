/**
 * Password Recovery Service
 *
 *
 */

const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const config = require('../../config');
const ResetToken = require('../../api/resetTokens/controller');

const { sendEmail, sendInvalidEmail } = require('./ses');

/**
 * Creates actual token that will be appended to URL and decoded
 * in FE to determine the account being updated
 *
 * @param {object} user
 * @param {string} ipAddress
 * @returns
 */
const createPasswordResetToken = (user, ipAddress) => {
  const tokenId = uuid();
  const signedData = {
    tokenId,
    user: {
      email: user.email,
      firstName: user.firstName,
    },
  };

  const token = jwt.sign(signedData, config.JWT_SECRET, {
    subject: user.firstName,
    expiresIn: config.JWT_PASSWORD_RESET_EXPIRY,
    algorithm: 'HS256',
  });
  return {
    token,
    ipAddress,
    tokenId,
  };
};

module.exports = {
  /**
   * Send VALID Email
   *
   * @param {string} recipient - Email of recipient
   * @param {object} user - user account associated with Email
   * @param {string} userAgent.ipAddress - IP address of requesting source
   * @param {string} userAgent.browser - Browser of requesting source
   * @param {string} userAgent.operatingSystem - OS of requesting source
   * @param {function} done -  callback function
   */
  sendEmail: async (recipient, user, userAgent, done) => {
    console.log({ recipient, user, userAgent, done });
    const { ipAddress, browser, operatingSystem } = userAgent;
    // create identity JWT token to use in FE
    const { token, tokenId } = await createPasswordResetToken(user, ipAddress);

    try {
      const res = await ResetToken.createResetToken({
        tokenId,
        email: recipient,
        requestingIP: ipAddress,
        isActive: true,
      });
      // eslint-disable-next-line no-console
      console.log({ res });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log({ err });
    }

    try {
      const info = await sendEmail({
        recipient,
        token,
        user,
        ipAddress,
        browser,
        operatingSystem,
      });
      // log mocked link information
      done(null, info);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log({ err });
      done(err);
    }
  },
  /**
   * Send INVALID Email
   *
   * @param {string} recipient - Email
   * @param {object} _ - null --> no user
   * @param {string} userAgent.ipAddress - IP address of requesting source
   * @param {string} userAgent.browser - Browser of requesting source
   * @param {string} userAgent.operatingSystem - OS of requesting source
   * @param {function} done -  callback function
   */
  sendInvalidEmail: async (recipient, _, userAgent, done) => {
    const { ipAddress, browser, operatingSystem } = userAgent;
    // eslint-disable-next-line no-console
    console.log({ recipient, _, ipAddress, done });

    try {
      const info = await sendInvalidEmail({
        recipient,
        ipAddress,
        browser,
        operatingSystem,
      });
      // log mocked link information
      done(null, info);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log({ err });
      done(err);
    }
  },
};
