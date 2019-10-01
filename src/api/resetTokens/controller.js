/**
 * ResetToken Controller
 *
 *
 */

const ResetTokens = require('../../models/resetToken');
const {
  checkForFields,
  checkForValidStrings,
  // checkForSizedFields,
  checkForValidType,
} = require('../../utils/validators');

const isDev = process.env.NODE_ENV !== 'production';

/**
 * List ResetTokens
 */
exports.listResetTokens = () =>
  new Promise((resolve, reject) => {
    ResetTokens.find()
      .exec()
      .then(resetTokens => {
        resolve(resetTokens.map(resetToken => resetToken.apiRepr()));
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        if (isDev) console.error(err);

        reject({ code: 500, err }); // 500 Internal Server Error
      });
  });

/**
 * Fetch ResetToken by id
 */
exports.fetchResetTokenById = tokenId =>
  new Promise((resolve, reject) => {
    ResetTokens.findById(tokenId)
      .then(resetToken => {
        resolve(resetToken ? resetToken.apiRepr() : null);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        if (isDev) console.error(err);

        reject({ code: 500, err }); // 500 Internal Server Error
      });
  });

exports.validateResetToken = id =>
  new Promise((resolve, reject) => {
    ResetTokens.findById(id)
      .exec()
      .then(resetToken => {
        if (!resetToken || !resetToken.isActive) {
          return resolve(false);
        }
        resolve(true);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        if (isDev) console.error(err);

        reject({ code: 500, err }); // 500 Internal Server Error
      });
  });

/**
 * create ResetToken
 *
 * User Required Fields: [ResetTokenDescription]
 */
exports.createResetToken = newResetToken =>
  new Promise(async (resolve, reject) => {
    // - - - - - - - - - -
    // Validate user fields
    // - - - - - - - - - -

    // 1. check for required fields
    const fields = ['email', 'tokenId', 'requestingIP'];
    const fieldError = checkForFields(newResetToken, fields);
    if (fieldError) return reject(fieldError); // return to stop code execution
    // 1. check for required fields
    const stringsError = checkForValidStrings(newResetToken, fields);
    if (stringsError) return reject(stringsError); // return to stop code execution

    // need to lookup other tokens for this Email and disable them
    const { email } = newResetToken;

    try {
      // deactivate existing user tokens, if they exist
      const res = await ResetTokens.updateMany(
        { email, isActive: true },
        { isActive: false, updatedAt: new Date().toString() },
      );

      // now create the new reset token
      const resetToken = await ResetTokens.create(newResetToken);

      resolve(resetToken.apiRepr());
    } catch (err) {
      // eslint-disable-next-line no-console
      if (isDev) console.error(err);

      reject({ code: 500, err }); // 500 Internal Server Error
    }
  });

/**
 * update ResetToken
 */
exports.updateResetToken = (id, data) =>
  new Promise((resolve, reject) => {
    const updatableFields = ['isActive'];
    const updatedResetToken = {};
    for (let field of updatableFields) {
      if (field in data) {
        updatedResetToken[field] = data[field];
      }
    }

    ResetTokens.findByIdAndUpdate(
      id,
      { $set: updatedResetToken },
      { new: true },
    )
      .exec()
      .then(([rowsEffected]) => {
        if (rowsEffected) {
          // fetch ResetToken
          return ResetTokens.findById(id);
        }
        return reject({
          reason: 'DatabaseError',
          message: 'No rows affected',
          location: `For id ${id}`,
        });
      })
      .then(resetToken => {
        return resolve(resetToken.apiRepr());
      })
      .catch(err => {
        // eslint-disable-next-line
        console.log({ err });

        reject({ code: 500, err }); // 500 Internal Server Error
      });
  });

/**
 * Destroy ResetTokens
 */
exports.destroyResetToken = id =>
  new Promise((resolve, reject) => {
    ResetTokens.findByIdAndRemove(id)
      .then(detailedResetToken => {
        resolve(detailedResetToken);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        if (isDev) console.error(err);

        reject({ code: 500, err }); // 500 Internal Server Error
      });
  });
