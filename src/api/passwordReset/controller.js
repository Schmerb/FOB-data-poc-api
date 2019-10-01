/* eslint-disable prefer-promise-reject-errors */

/**
 * Password Reset Controller
 *
 *
 */

const passwordRecovery = require('../../services/passwordRecovery');
const User = require('../../models/user');
const {
  checkForFields,
  checkForValidStrings,
} = require('../../utils/validators');

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Validate request to reset password
 *
 * @param {object} body
 */
exports.validate = body =>
  new Promise((resolve, reject) => {
    // - - - - - - - - - - - -
    // Validate email field
    // - - - - - - - - - - - -
    const fields = ['email'];
    // 1. check for required fields
    const fieldError = checkForFields(body, fields);
    if (fieldError) return reject(fieldError); // return to stop code execution
    // 2. check for valid string fields
    const stringError = checkForValidStrings(body, fields);
    if (stringError) return reject(stringError);
    // resolve promise here to let user know if valid request or not,
    // whether email exists or not
    return resolve(body.email);
  });

/**
 * Find user by email
 *
 * @param {string} email
 */
const findUserByEmail = email =>
  new Promise((resolve, reject) => {
    User.findOne({ email })
      .then(user => {
        resolve(user ? user.apiRepr() : null);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        if (isDev) console.error(err);

        reject({ code: 500, err }); // 500 Internal Server Error
      });
  });

exports.findUserByEmail = findUserByEmail;

/**
 * Routine to send password reset email
 *
 * @param {string} email
 */
exports.initiate = (email, userAgentInfo) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await findUserByEmail(email);
      if (user) {
        // user is good
        // generate a token
        passwordRecovery.sendEmail(email, user, userAgentInfo, (err, info) => {
          if (err) {
            return reject(err);
          }
          resolve(info);
        });
      } else {
        // email not associated with a user account
        // send basic email stating no account associated
        passwordRecovery.sendInvalidEmail(
          email,
          null,
          userAgentInfo,
          (err, info) => {
            if (err) {
              return reject(err);
            }
            resolve(info);
          },
        );
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      if (isDev) console.error(err);

      reject({ code: 500, err }); // 500 Internal Server Error
    }
  });
