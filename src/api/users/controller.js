/**
 *
 * User Controller
 *
 */

const User = require('../../models/user');
const {
  checkForFields,
  checkForValidStrings,
  checkForExplicitTrim,
  checkForSizedFields,
} = require('../../utils/validators');

const isDev = process.env.NODE_ENV !== 'production';

/**
 * List users
 */
exports.listUsers = () =>
  new Promise((resolve, reject) => {
    return User.find()
      .then(users => {
        resolve(users.map(user => user.apiRepr()));
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        if (isDev) console.error(err);

        reject({ code: 500, err }); // 500 Internal Server Error
      });
  });

/**
 * Create user
 */
exports.createUser = newUser =>
  new Promise((resolve, reject) => {
    // - - - - - - - - - - - -
    // Validate user fields
    // - - - - - - - - - - - -

    // 1. check for required fields
    const fields = ['email', 'username', 'password'];
    const fieldError = checkForFields(newUser, fields);
    if (fieldError) return reject(fieldError); // return to stop code execution

    // 2. check for valid string fields
    const stringError = checkForValidStrings(newUser, [
      'email',
      'username',
      'password',
      'firstName',
      'lastName',
    ]);
    if (stringError) return reject(stringError);

    // 3. check for valid string fields
    const fieldSizeError = checkForSizedFields(newUser, {
      username: {
        min: 1,
      },
      password: {
        min: 10,
        // bcrypt truncates after 72 characters, so let's not give the illusion
        // of security by storing extra (unused) info
        max: 72,
      },
    });
    if (fieldSizeError) return reject(fieldSizeError);

    const { email, username, password, firstName, lastName } = newUser;
    //
    // check if email exists
    //
    return User.find({ username })
      .count()
      .exec()
      .then(count => {
        if (count > 0) {
          // There is an existing user with the same username
          return reject({
            code: 422,
            reason: 'ValidationError',
            message: 'Username already taken',
            location: 'username',
          });
        }
        return User.find({ email })
          .count()
          .exec();
      })
      .then(count => {
        if (count > 0) {
          // There is an existing user with the same username
          return reject({
            code: 422,
            reason: 'ValidationError',
            message: 'Email already taken',
            location: 'email',
          });
        }
        // If there is no existing user, hash the password
        return User.hashPassword(password);
      })
      .then(hash => {
        return User.create({
          email,
          username,
          password: hash,
          firstName,
          lastName,
        });
      })
      .then(user => {
        return resolve(user.apiRepr());
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        if (isDev) console.error(err);

        reject({ code: 500, err }); // 500 Internal Server Error
      });
  });

/**
 * Fetch user by id
 */
exports.fetchUserById = id =>
  new Promise((resolve, reject) => {
    User.findById(id)
      .then(user => resolve(user ? user.apiRepr() : null))
      .catch(err => {
        // eslint-disable-next-line no-console
        if (isDev) console.error(err);

        reject({ code: 500, err }); // 500 Internal Server Error
      });
  });

/**
 * Update user
 */
exports.updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    const updatableFields = [
      'email',
      'firstName',
      'lastName',
      'username',
      'reportID',
      'groupID', // id indicates if processed or not
      'phoneNumber',
      'password',
    ];
    const updatedUser = {};
    for (let field of updatableFields) {
      if (field in data) {
        console.log(field, data[field]);

        updatedUser[field] = data[field];
      }
    }

    console.log({ updatedUser });

    // validate new email/phone
    if ('email' in updatedUser) {
      try {
        const users = await User.find({ email: updatedUser.email }).exec();
        const count = users.length;
        if (count > 0) {
          const userId = users[0]._id.toString();
          if (!userId.includes(id)) {
            return reject({
              code: 422,
              reason: 'ValidationError',
              message:
                'An account is already registered with this email, please use a different email address.',
              location: 'email',
            });
          }
        }
      } catch (err) {
        console.log({ err });
      }
    }

    if ('phoneNumber' in updatedUser) {
      try {
        const users = await User.find({
          phoneNumber: updatedUser.phoneNumber,
        }).exec();
        const count = users.length;
        if (count > 0) {
          const userId = users[0]._id.toString();
          if (!userId.includes(id)) {
            return reject({
              code: 422,
              reason: 'ValidationError',
              message:
                'An account is already registered with this phone number, please use a different phone number.',
              location: 'phoneNumber',
            });
          }
        }
      } catch (err) {
        console.log({ err });
      }
    }

    console.log({ id });

    User.findByIdAndUpdate(id, { $set: updatedUser }, { new: true })
      .exec()
      .then(_updatedUser => {
        if (_updatedUser) {
          return resolve(_updatedUser.apiRepr());
        }
        return resolve(true);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        if (isDev) console.error(err);

        reject({ code: 500, err }); // 500 Internal Server Error
      });
  });
};

/**
 * Update Me
 */
exports.updateMe = (id, data) => {
  return new Promise(async (resolve, reject) => {
    const updatableFields = [
      'email',
      'firstName',
      'lastName',
      'username',
      'reportID',
      'groupID', // id indicates if processed or not
      'phoneNumber',
      'password',
    ];

    const updatedUser = {};
    for (let field of updatableFields) {
      if (field in data) {
        updatedUser[field] = data[field];
      }
    }

    // validate new email/phone
    if ('email' in updatedUser) {
      try {
        const users = await User.find({ email: updatedUser.email }).exec();
        const count = users.length;
        if (count > 0) {
          const userId = users[0]._id.toString();
          if (!userId.includes(id)) {
            return reject({
              code: 422,
              reason: 'ValidationError',
              message:
                'An account is already registered with this email, please use a different email address.',
              location: 'email',
            });
          }
        }
      } catch (err) {
        console.log({ err });
      }
    }

    if ('phoneNumber' in updatedUser) {
      try {
        const users = await User.find({
          phoneNumber: updatedUser.phoneNumber,
        }).exec();
        const count = users.length;
        if (count > 0) {
          const userId = users[0]._id.toString();
          if (!userId.includes(id)) {
            return reject({
              code: 422,
              reason: 'ValidationError',
              message:
                'An account is already registered with this phone number, please use a different phone number.',
              location: 'phoneNumber',
            });
          }
        }
      } catch (err) {
        console.log({ err });
      }
    }

    if ('password' in updatedUser && 'newPassword' in data) {
      let isValid;
      let user;
      // first check if password is valid for current user
      try {
        user = await User.findById(id).exec();
      } catch (error) {
        console.log({ error });
      }
      try {
        // check if original password is correct
        isValid = await user.validatePassword(updatedUser.password);
      } catch (error) {
        console.log({ error });
      }

      if (isValid) {
        const sizedFields = {
          // username: {
          //   min: 1
          // },
          password: {
            min: 10,
            // bcrypt truncates after 72 characters, so let's not give the illusion
            // of security by storing extra (unused) info
            max: 72,
          },
        };
        const tooSmallField = Object.keys(sizedFields).find(
          field =>
            'min' in sizedFields[field] &&
            typeof data[field] !== 'undefined' &&
            data[field].trim().length < sizedFields[field].min,
        );
        const tooLargeField = Object.keys(sizedFields).find(
          field =>
            'max' in sizedFields[field] &&
            typeof data[field] !== 'undefined' &&
            data[field].trim().length > sizedFields[field].max,
        );

        if (tooSmallField || tooLargeField) {
          return reject({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField
              ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
              : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
            location: tooSmallField || tooLargeField,
          });
        }

        const { newPassword } = data;
        try {
          const hash = await User.hashPassword(newPassword);
          updatedUser.password = hash;
        } catch (err) {
          console.log({ err });
        }
      } else {
        return reject({
          code: 401,
          reason: 'ValidationError',
          message: 'Password is incorrect, please try again.',
          location: 'password',
        });
      }
    }

    User.findByIdAndUpdate(id, { $set: updatedUser }, { new: true })
      .exec()
      .then(_updatedUser => {
        if (_updatedUser) {
          return resolve(_updatedUser.apiRepr());
        }
        return resolve(true);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        if (isDev) console.error(err);

        reject({ code: 500, err }); // 500 Internal Server Error
      });
  });
};

/**
 * Destroy user
 */
exports.destroyUser = id =>
  new Promise((resolve, reject) => {
    User.findByIdAndRemove(id)
      .then(deletedUser => {
        resolve(deletedUser);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        if (isDev) console.error(err);

        reject({ code: 500, err }); // 500 Internal Server Error
      });
  });
