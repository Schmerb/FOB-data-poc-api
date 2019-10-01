// 'use strict';

// const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken');
// const uuid = require('uuid');

// const config = require('../../config');
// const ResetToken = require('../../api/resetToken/controller');

// const sendEmail = require('./ses').sendEmail;

// const {
//   htmlBodyTemplate,
//   textTemplate,
//   invalidTextTemplate,
//   invalidHtmlBodyTemplate,
// } = require('./templates');

// const _user = {
//   firstName: 'Mike',
//   lastName: 'Schmerbeck',
//   operatingSystem: 'MacOS',
//   browserName: 'Chrome',
//   ip_address: '200.231.677.72',
// };

// const createPasswordResetToken = (user, ipAddress) => {
//   const id = uuid();
//   const token = jwt.sign({ user, id }, config.JWT_SECRET, {
//     subject: user.FirstName,
//     expiresIn: config.JWT_PASSWORD_RESET_EXPIRY,
//     algorithm: 'HS256',
//   });
//   return {
//     token,
//     ipAddress,
//     id,
//   };
// };

// const createTestAccount = async () => await nodemailer.createTestAccount();

// const createTransporter = testAccount => {
//   return nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user, // generated ethereal user
//       pass: testAccount.pass, // generated ethereal password
//     },
//   });
// };

// /**
//  * Sends a valid password reset email with an email reset link
//  * with special token
//  *
//  * @param {object} transporter
//  * @param {object} user
//  * @param {string} recipient
//  * @returns
//  */
// const sendTestResetEmail = async (
//   transporter,
//   user,
//   recipient,
//   token,
//   ipAddress,
// ) => {
//   // send mail with defined transport object
//   return await transporter.sendMail({
//     from: '"Dreamtek Support 👻" <support@dreamtek-service-portal.com>', // sender address
//     to: recipient, // list of receivers, csv's
//     subject: 'Password Recovery', // Subject line
//     text: textTemplate(user, ipAddress), // plain text body
//     html: htmlBodyTemplate(user, token, ipAddress), // html body
//   });
// };

// /**
//  * Sends an invalid email to address provided
//  *
//  * @param {object} transporter
//  * @param {object} user
//  * @param {string} recipient
//  * @returns
//  */
// const sendTestInvalidEmail = async (transporter, _, recipient, ipAddress) => {
//   // send mail with defined transport object
//   return await transporter.sendMail({
//     from: '"Dreamtek Support 👻" <support@dreamtek-service-portal.com>', // sender address
//     to: recipient, // list of receivers, csv's
//     subject: 'Password Recovery', // Subject line
//     text: invalidTextTemplate(_user, ipAddress), // plain text body
//     html: invalidHtmlBodyTemplate(_user, ipAddress), // html body
//   });
// };

// const getInfoUrl = info => nodemailer.getTestMessageUrl(info);

// /**
//  *
//  *
//  * @param {object} info
//  */
// const logOutput = info => {
//   // eslint-disable-next-line no-console
//   console.log('Message sent: %s', info.messageId);
//   // eslint-disable-next-line no-console
//   console.log('Preview URL: %s', getInfoUrl(info));
// };

// const getTestTransporter = async () => {
//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   const testAccount = await createTestAccount();
//   // create reusable transporter object using the default SMTP transport
//   const transporter = createTransporter(testAccount);

//   return transporter;
// };

// module.exports = {
//   // a VALID email
//   sendEmail: async (recipient, user, ipAddress, done) => {
//     // create identity JWT token to use in FE
//     const { token, id } = await createPasswordResetToken(user, ipAddress);

//     try {
//       const res = await ResetToken.createResetToken({
//         id,
//         Email: recipient,
//         RequestingIP: ipAddress,
//         IsActive: true,
//       });
//       // eslint-disable-next-line no-console
//       console.log({ res });
//     } catch (err) {
//       // eslint-disable-next-line no-console
//       console.log({ err });
//     }

//     // recipient --> Email
//     // user --> user account associated with Email
//     // ipAddress --> IP address of requesting source
//     // done -- callback function

//     const info = await sendEmail({ recipient, token, user, ipAddress });
//     // log mocked link information
//     logOutput(info);
//     done(info);
//   },
//   // an INVALID email
//   sendTestInvalidEmail: async (recipient, _no_user, ipAddress, done) => {
//     _user.ip_address = ipAddress;
//     // grab transporter
//     const transporter = await getTestTransporter();
//     // create identity JWT token to use in FE
//     // const { token, id } = await createPasswordResetToken(
//     //   user || _user,
//     //   ipAddress
//     // );
//     // send mail with defined transport object
//     const info = await sendTestInvalidEmail(
//       transporter,
//       null,
//       recipient,
//       null,
//       ipAddress,
//     );
//     // log mocked link information
//     logOutput(info);
//     done(getInfoUrl(info));
//   },
// };

// // module.exports = {
// //   // a VALID email
// //   sendEmail: async (recipient, user, ipAddress, done) => {
// //     _user.ip_address = ipAddress;
// //     // grab transporter
// //     const transporter = await getTestTransporter();
// //     // create identity JWT token to use in FE
// //     const { token, id } = await createPasswordResetToken(
// //       user || _user,
// //       ipAddress
// //     );

// //     try {
// //       const res = await ResetToken.createResetToken({
// //         id,
// //         Email: recipient,
// //         RequestingIP: ipAddress,
// //         IsActive: true,
// //       });
// //       console.log({ res });
// //     } catch (err) {
// //       console.log({ err });
// //     }

// //     // send mail with defined transport object
// //     const info = await sendTestResetEmail(
// //       transporter,
// //       user || _user, // for testing
// //       recipient,
// //       token,
// //       ipAddress
// //     );
// //     // log mocked link information
// //     logOutput(info);
// //     done(getInfoUrl(info));
// //   },
// //   // an INVALID email
// //   sendTestInvalidEmail: async (recipient, _no_user, ipAddress, done) => {
// //     _user.ip_address = ipAddress;
// //     // grab transporter
// //     const transporter = await getTestTransporter();
// //     // create identity JWT token to use in FE
// //     // const { token, id } = await createPasswordResetToken(
// //     //   user || _user,
// //     //   ipAddress
// //     // );
// //     // send mail with defined transport object
// //     const info = await sendTestInvalidEmail(
// //       transporter,
// //       null,
// //       recipient,
// //       null,
// //       ipAddress
// //     );
// //     // log mocked link information
// //     logOutput(info);
// //     done(getInfoUrl(info));
// //   },
// // };
