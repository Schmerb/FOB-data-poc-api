/**
 * PasswordChange Controller
 *
 *
 */

// const Users = require('../../modules/sequelize').models.User;
const ResetToken = require('../../models/resetToken');
const User = require('../../models/user');
const {
  checkForFields,
  checkForValidStrings,
  checkForSizedFields,
  // checkForValidType,
} = require('../../utils/validators');

const isDev = process.env.NODE_ENV !== 'production';

/**
 * change Password
 *
 * @param {object} user - user object from JWT bearer token
 * @param {object} data.Password = users current password
 * @param {object} data.NewPassword = users new, desired password
 */
exports.changePassword = (user, data) =>
  new Promise(async (resolve, reject) => {
    // 1. check for required fields
    const fields = ['password', 'newPassword'];
    const fieldError = checkForFields(data, fields);
    if (fieldError) return reject(fieldError); // return to stop code execution
    // 2. check for valid string fields
    const stringError = checkForValidStrings(data, fields);
    if (stringError) return reject(stringError);
    // 3. check for valid string fields
    const fieldSizeError = checkForSizedFields(data, {
      newPassword: {
        min: 8, // make this 10?
        // bcrypt truncates after 72 characters, so let's not give the illusion
        // of security by storing extra (unused) info
        max: 72,
      },
    });
    if (fieldSizeError) return reject(fieldSizeError);

    // check if user exists
    // validate current password
    // encrypt new password
    // update user
    try {
      const _user = await User.findById(user.id);

      // failsafe
      // shouldnt happen due to authorization strategy
      // but just in case
      if (!_user) {
        return reject({
          code: 422,
          reason: 'ValidationError',
          message: `User with id '${user.id}' does not exist.`,
          location: 'id',
        });
      }

      // validate correct password
      const isValid = await _user.validatePassword(data.password);
      // console.log({ isValid });

      if (!isValid) {
        return reject({
          code: 422,
          reason: 'ValidationError',
          message: `Invalid password`,
          location: 'password',
        });
      }

      // hash the new password
      const encryptedPassword = await User.hashPassword(data.newPassword);

      _user.password = encryptedPassword;
      await _user.save();

      resolve(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      if (isDev) console.error(err);

      reject({ code: 500 }); // 500 Internal Server Error
    }
  });

exports.changePasswordFromReset = data =>
  new Promise(async (resolve, reject) => {
    // 1. check for required fields
    const fields = ['tokenId', 'user', 'password'];
    const fieldError = checkForFields(data, fields);
    if (fieldError) return reject(fieldError); // return to stop code execution
    // 2. check for valid string fields
    const stringFields = ['tokenId', 'password'];
    const stringError = checkForValidStrings(data, stringFields);
    if (stringError) return reject(stringError);
    // 3. check for valid string fields
    const fieldSizeError = checkForSizedFields(data, {
      password: {
        min: 8, // make this 10?
        // bcrypt truncates after 72 characters, so let's not give the illusion
        // of security bystoring extra (unused) info
        max: 72,
      },
    });
    if (fieldSizeError) return reject(fieldSizeError);

    // check that token is valid
    // check if user exists
    // validate current password
    // encrypt new password
    // update user
    const { user, tokenId } = data;

    try {
      const resetToken = await ResetToken.findOne({
        tokenId,
      }).exec();
      console.log({ resetToken });
      if (!resetToken || !resetToken.isActive) {
        return reject({
          code: 422,
          reason: 'ValidationError',
          message: `Token is invalid`,
          location: 'token',
        });
      }
      // token is good, continue

      const _user = await User.findOne({ email: user.email });

      // failsafe
      // shouldnt happen due to authorization strategy
      // but just in case
      if (!_user) {
        return reject({
          code: 422,
          reason: 'ValidationError',
          message: `User with email '${user.email}' does not exist.`,
          location: 'email',
        });
      }

      // hash the new password
      const encryptedPassword = await User.hashPassword(data.password);

      // update password on model instance
      _user.password = encryptedPassword;
      // save it to db
      await _user.save();

      resolve(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      if (isDev) console.error(err);

      reject({ code: 500 }); // 500 Internal Server Error
    }
  });
