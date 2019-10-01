// Load the AWS SDK for Node.js

const AWS = require('aws-sdk');

const {
  htmlBodyTemplate,
  textTemplate,
  invalidTextTemplate,
  invalidHtmlBodyTemplate,
} = require('./templates');

// Set the region

AWS.config.update({
  region: 'eu-west-1',
});

const ses = new AWS.SES();

const getParams = ({ html, text, recipient }) => ({
  Destination: {
    ToAddresses: [recipient], // Email address/addresses that you want to send your email
  },
  ConfigurationSetName: '',
  Message: {
    Body: {
      Html: {
        // HTML Format of the email
        Charset: 'UTF-8',
        Data: html,
      },
      Text: {
        Charset: 'UTF-8',
        Data: text,
      },
    },
    Subject: {
      Charset: 'UTF-8',
      Data: 'Account Password Reset',
    },
  },
  Source: 'no_reply@app2-reporting.cleancar.io',
});

const sendEmail = ({
  recipient,
  token,
  user,
  ipAddress,
  browser,
  operatingSystem,
}) => {
  const props = {
    firstName: user.firstName,
    token,
    ipAddress,
    browser,
    operatingSystem,
  };
  // html
  const html = htmlBodyTemplate(props);
  // text
  const text = textTemplate(props);
  // subject
  const params = getParams({ html, text, recipient });

  return ses.sendEmail(params).promise();
};

const sendInvalidEmail = ({
  recipient,
  ipAddress,
  browser,
  operatingSystem,
}) => {
  const props = {
    ipAddress,
    browser,
    operatingSystem,
  };
  // html
  const html = invalidHtmlBodyTemplate(props);
  // text
  const text = invalidTextTemplate(props);
  // subject
  const params = getParams({ html, text, recipient });

  return ses.sendEmail(params).promise();
};

// exports.sendEmail = sendEmail;
// exports.sendInvalidEmail = sendInvalidEmail;

module.exports = {
  sendEmail,
  sendInvalidEmail,
};
