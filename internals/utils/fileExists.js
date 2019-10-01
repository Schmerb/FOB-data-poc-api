/**
 * componentExists
 *
 * Check whether the given component exist in either the components or containers directory
 */

const fs = require('fs');
const path = require('path');

const apis = fs.readdirSync(path.join(__dirname, '../../src/api'));
const models = fs.readdirSync(path.join(__dirname, '../../src/models'));
const files = apis.concat(models);

function componentExists(comp) {
  return files.indexOf(comp) >= 0;
}

module.exports = componentExists;
