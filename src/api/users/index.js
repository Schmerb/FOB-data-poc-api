/**
 *
 * User Router
 *
 */

const bodyParser = require('body-parser');

const usersController = require('./controller');

const jsonParser = bodyParser.json();

function userRoutes(router, connectDb, authenticate) {
  /**
   * ME user
   *
   * current user from valid JWT token
   *
   *
   */

  const meRoutesMiddleware = [connectDb, authenticate, jsonParser];

  /**
   * Fetch current user
   */
  router.get('/api/users/me', meRoutesMiddleware, async (req, res) => {
    const { id } = req.user;

    return usersController
      .fetchUserById(id)
      .then(data => {
        return res.status(200).json(data); // 200 OK
      })
      .catch(err => {
        if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err);
        }
        return res.send(err);
      });
  });

  /**
   * Delete current user's account
   */
  router.delete('/api/users/me', meRoutesMiddleware, async (req, res) => {
    const { id } = req.user;

    return usersController
      .destroyUser(id)
      .then(data => {
        return res.sendStatus(204); // 204 OK, No Content
      })
      .catch(err => {
        if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err);
        }
        return res.send(err);
      });
  });

  /**
   * Fetch user by id
   */
  router.put('/api/users/me', meRoutesMiddleware, async (req, res) => {
    const { id } = req.user;
    const { body } = req;

    return usersController
      .updateMe(id, body)
      .then(data => {
        return res.sendStatus(204); // 204 OK, No Content
      })
      .catch(err => {
        if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err);
        }
        return res.send(err);
      });
  });

  /**
   * Normal users
   *
   * All users in db
   *
   */

  /**
   * List users
   */
  router.get('/api/users', connectDb, async (req, res) => {
    return usersController
      .listUsers()
      .then(data => {
        return res.status(200).json(data); // 200 OK
      })
      .catch(err => {
        if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err);
        }
        console.log({ err });
        return res.send(err);
      });
  });

  /**
   * Fetch User by id
   */
  router.get('/api/users/:id', connectDb, jsonParser, async (req, res) => {
    const { id } = req.params;

    return usersController
      .fetchUserById(id)
      .then(data => {
        return res.status(200).json(data); // 200 OK
      })
      .catch(err => {
        if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err);
        }
        return res.send(err);
      });
  });

  /**
   * Create user
   */
  router.post('/api/users', connectDb, jsonParser, async (req, res) => {
    const { body } = req;
    return usersController
      .createUser(body)
      .then(newUser => {
        return res.status(201).json(newUser); // 201 Created
      })
      .catch(err => {
        if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err);
        }
        return res.send(err);
      });
  });

  /**
   * Update user
   */
  router.put('/api/users/:id', connectDb, jsonParser, async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    console.log({ id, body });

    return usersController
      .updateUser(id, body)
      .then(updatedUser => {
        return res.status(200).json(updatedUser);
      })
      .catch(err => {
        if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err);
        }
        return res.send(err);
      });
  });

  /**
   * Destroy user
   */
  router.delete('/api/users/:id', connectDb, authenticate, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    // authenticate middleware makes sure req.user is valid
    // make sure user is trying to delete their own account

    // Users can only delete themselves, UserAdmins can delete any User
    if (id !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({
        code: 401,
        reason: 'UnauthorizedError',
        message: `You are not authorized to delete user with id ${id}`,
        location: ':id',
      });
    }

    // user authenticated, allow deletion
    return usersController
      .destroyUser(id)
      .then(() => {
        return res.sendStatus(204); // 204 OK, No Content
      })
      .catch(err => {
        if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err);
        }
        return res.sendStatus(err.code);
      });
  });
}

module.exports = userRoutes;
