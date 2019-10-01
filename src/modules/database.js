/* eslint-disable prefer-destructuring */

/**
 *
 * Database - Mongoose / MongoDB
 *
 *
 */
require('dotenv').config();

const mongoose = require('mongoose');

const DATABASE_URI_DEV = process.env.DATABASE_URI_DEV;
const DATABASE_URI_PROD = process.env.DATABASE_URI_PROD;
const NODE_ENV = process.env.NODE_ENV;

const isDev = NODE_ENV !== 'production';

const DB_URI = isDev ? DATABASE_URI_DEV : DATABASE_URI_PROD; // these are identical for now

console.log({ DATABASE_URI_DEV });
console.log({ DATABASE_URI_PROD });
console.log({ NODE_ENV });
console.log({ isDev });
console.log({ DB_URI });

let isConnected;

const connectToDatabase = () =>
  new Promise((resolve, reject) => {
    if (isConnected) {
      // eslint-disable-next-line no-console
      console.log('=> using existing database connection');
      return resolve();
    }
    // eslint-disable-next-line no-console
    console.log('=> using new database connection');
    return mongoose
      .connect(
        'mongodb+srv://cc-reporting-admin:sJ8QTpiLXv9ydYF2nZcxqgJDhyGV@cc-reporting-mvxig.mongodb.net/test?retryWrites=true&w=majority',
        {
          useNewUrlParser: true,
          // poolSize: 10,
          // socketTimeoutMS: 0,
          // keepAlive: true,
          // reconnectTries: 30,
        },
      )
      .then(
        db => {
          isConnected = db.connections[0].readyState;
          // eslint-disable-next-line no-console
          console.log('=> db is connected: ', isConnected);
          // app.listen() --> taken care of by aws-serverless-express
          resolve();
        },
        err => {
          return reject(err);
        },
      );
  });

exports.connectToDatabase = connectToDatabase;
