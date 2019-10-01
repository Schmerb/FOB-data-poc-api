/**
 * App entry file for AWS Lambda
 *
 */

const express = require('express');
const { bindMiddleware } = require('./src/modules/middleware');
const { connectToDatabase } = require('./src/modules/database');
const { initializeApi } = require('./src/api');

const isDev = process.env.NODE_ENV !== 'production';

// EXPRESS INSTANCE
const app = express();

// setup all the middlewares
bindMiddleware(app);
// eslint-disable-next-line no-console
console.log('>>> bindMiddleware');

initializeApi(app, connectToDatabase);
// eslint-disable-next-line no-console
console.log('>>> initializeApi');

// Fallback for all non-valid endpoints
app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

app.listen(8080, () => {
  // connectToDatabase();
  console.log('listening on 8080');
});

module.exports = app;
