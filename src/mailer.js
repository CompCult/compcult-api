var nodeMailer = require('nodemailer');
const config = require('config');

class Mailer {
  static sendMail(email, subject, message) {
    var transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: config.get('MAILER_MAIL'),
        pass: config.get('MAILER_PASS')
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
    });

    console.log(config.get('MAILER_MAIL'));


    var mailOptions = {
      from: config.get('MAIL_SENDER') + ' <ufcgcompcult@gmail.com>', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: message, // plaintext body
      html: message
    };

    transporter.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
      } else {
        console.log('Message sent!');
      }

      transporter.close(); // shut down the connection pool, no more messages
    });
  }
}

module.exports = Mailer;
