const nodemailer = require('nodemailer');
require('dotenv').config();
const env = process.env;

function genVerificationEmail(id) {
  const HOST = 'https://bug-zapper-app.herokuapp.com';
  const link = HOST + '/api/verify/' + id;
  let text = 'Verify email at this link!\n' + link;
  let html = text;
  return [text, html];
}

class Mailer {
  #user;
  #pass;
  constructor(user, pass) {
    this.#user = user;
    this.#pass = pass;
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass,
      },
    });
  }
  async sendMail(to, subject, text, html) {
    return this.transporter
      .sendMail({
        from: 'Automail ' + this.#user,
        to: to,
        subject: subject,
        text: text,
        html: html,
      })
      .then((info) => {
        console.log(info);
      })
      .catch(console.error);
  }

  async verificationEmail(id, email) {
    const [text, html] = genVerificationEmail(id);
    return this.sendMail(email, 'Verify your email with us!', text, html);
  }
}

var mailer = new Mailer(env.MAIL, env.M_PASS);

module.exports = mailer;
