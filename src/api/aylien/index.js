/**
 * Aylien Router
 *
 *
 */

const bodyParser = require('body-parser');

const { BASE_PATH } = require('../../config');
const { checkForFields } = require('../../utils/validators');
const AylienService = require('../../services/aylien');

const jsonParser = bodyParser.json();

function aylienRoutes(router) {
  /**
   * Create Aylien
   */
  router.post(`${BASE_PATH}/api/ayliens`, jsonParser, async (req, res) => {
    const { body, query } = req;
    // 1. check for required fields
    const fields = ['text'];
    const fieldError = checkForFields(query, fields);
    if (fieldError) return res.status(fieldError.code).json(fieldError);

    try {
      const data = await AylienService.searchStoriesText(query.text);
      return res.status(200).json(data); // 200 OK
    } catch (err) {
      return res.status(err.code || 500).json(err);
    }
  });
  /**
   * Create Aylien
   */

  router.post(
    `${BASE_PATH}/api/ayliens/title`,
    jsonParser,
    async (req, res) => {
      const { body, query } = req;
      // 1. check for required fields
      const fields = ['text'];
      const fieldError = checkForFields(query, fields);
      if (fieldError) return res.status(fieldError.code).json(fieldError);

      try {
        const data = await AylienService.searchStoriesText(query.text);
        return res.status(200).json(data); // 200 OK
      } catch (err) {
        return res.status(err.code || 500).json(err);
      }
    },
  );
  router.post(
    `${BASE_PATH}/api/ayliens/entityTitle`,
    jsonParser,
    async (req, res) => {
      const { body, query } = req;
      // 1. check for required fields
      const fields = ['text'];
      const fieldError = checkForFields(query, fields);
      if (fieldError) return res.status(fieldError.code).json(fieldError);

      try {
        const data = await AylienService.searchStoriesEntityTitle(query.text);
        return res.status(200).json(data); // 200 OK
      } catch (err) {
        return res.status(err.code || 500).json(err);
      }
    },
  );
}

module.exports = aylienRoutes;
