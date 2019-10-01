/**
 * ResetToken Router
 *
 *
 */

const bodyParser = require('body-parser');

const resetToken = require('./controller');

const jsonParser = bodyParser.json();

function resetTokenRoutes(router, connectDb, authenticate) {
  /**
   * List ResetTokens
   */
  router.get('/api/resetTokens', connectDb, async (req, res) => {
    return resetToken
      .listResetTokens()
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
   * Fetch ResetToken by id
   */
  router.get('/api/resetTokens/:id', connectDb, async (req, res) => {
    const { id } = req.params;

    return resetToken
      .fetchResetTokenById(id)
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
   * Valdate token by id
   *
   */
  router.get('/api/resetTokens/:id/validate', connectDb, async (req, res) => {
    const { id } = req.params;

    return resetToken
      .validateResetToken(id)
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
   * Create ResetToken
   */
  router.post(
    '/api/resetTokens',
    connectDb,
    jsonParser,
    // authenticate,
    async (req, res) => {
      const { body, ip } = req;

      return resetToken
        .createResetToken(body, ip)
        .then(data => {
          return res.status(200).json(data); // 200 OK
        })
        .catch(err => {
          if (err.reason === 'ValidationError') {
            return res.status(err.code).json(err);
          }
          return res.send(err);
        });
    },
  );

  /**
   * Update ResetToken
   */
  router.put('/api/resetTokens/:id', connectDb, async (req, res) => {
    const { id } = req.params;
    const { body, ip } = req;

    return resetToken
      .updateResetToken(id, body, ip)
      .then(updatedResetToken => {
        return res.status(200).json(updatedResetToken);
      })
      .catch(err => {
        if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err);
        }
        return res.send(err);
      });
  });

  /**
   * Destroy ResetToken
   */
  router.delete(
    '/api/resetTokens/:id',
    connectDb,
    authenticate,
    async (req, res) => {
      const { id } = req.params;

      return resetToken
        .destroyResetToken(id)
        .then(() => {
          return res.sendStatus(200); // 200 OK
        })
        .catch(err => {
          if (err.reason === 'ValidationError') {
            return res.status(err.code).json(err);
          }
          return res.send(err);
        });
    },
  );
}

module.exports = resetTokenRoutes;
