/**
 *  HTML Body Template for PasswordRecovery Email
 *
 * @param {string} { firstName }
 * @param {string} { operatingSystem }
 * @param {string} { browser }
 * @param {string} { ip_address }
 */
exports.htmlBodyTemplate = ({
  firstName,
  token,
  ipAddress,
  browser,
  operatingSystem,
}) => `
<html lang="en">
  <head>
    <meta charset="utf-8">
    <style>
    body {
      color: #000000;
    }
    .button {
      color: #ffffff;
      background-color: cornflowerblue;
      padding: 10px;
      font-size: 1.5rem;
    }
    .button a {
      color: #ffffff;
      text-decoration: none;
    }
    </style>
  </head>
  <body>
    <h2>Hi ${firstName},</h2>
    <p>
      You recently requested to reset your password for your V2GO account.
      <br />
      This password reset is only valid for 1 hour</b>
    </p>  
    <button class='button'>
      <a href="https://app2-reporting.cleancar.io/passwordReset/index.html?token=${token}">
        Reset your password
      </a>
    </button>
    <br />
    <p>
      For security, this request was received from a
      <b>${operatingSystem}</b> device using <b>${browser}</b>, from IP: <b>@${ipAddress}</b>.   
      <br />
      If you did not request a password reset, please ignore this email or contact support 
      if you have questions.
    </p>
    <p>
      Thanks,
      <br />
      <br />
      The V2GO Team
    </p>
  </body>
  </html>
`;

exports.textTemplate = ({
  firstName,
  token,
  ipAddress,
  browser,
  operatingSystem,
}) => `
  Hi ${firstName},
  You recently requested to reset your password for your V2GO account.
  This password reset is only valid for 24 hours
  For security, this request was received from a
  ${operatingSystem} device using ${browser}, from IP: @${ipAddress}. If you
  did not request a password reset, please ignore this email or contact support 
  if you have questions.

  please visit --> https://app2-reporting.cleancar.io/passwordReset/index.html?token=${token}

  Thanks,
  The V2GO Team
  `;

exports.invalidTextTemplate = ({ operatingSystem, browser, ipAddress }) => `
    A request was received from a ${operatingSystem} device using
    ${browser}, from IP: @${ipAddress}. 
    We are sorry, but no user account exists with this email address.
    Please try again or contact a system administrator if you think this is an error.
  `;

exports.invalidHtmlBodyTemplate = ({ operatingSystem, browser, ipAddress }) => `
  <html>
    <head>
    </head>
    <body>
      <p>
        A request was received from a
        <b>${operatingSystem}</b> device using <b>${browser}</b>, from IP: <b>@${ipAddress}</b>.
        We are sorry, but no user account exists with this email address.
        Please try again or contact a system administrator if you think this is an error.
      </p>
      <p>
        Thanks,
        <br />
        <br />
        The V2GO Team
      </p>
    </body>
  </html>
  `;
