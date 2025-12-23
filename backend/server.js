const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());
app.use(bodyParser.json());

// simulazione database utenti
let users = {
  "a78335323@gmail.com": { password: "vecchiaPassword" }
};

let resetTokens = {};

// EMAIL CONFIG
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'a78335323@gmail.com',
    pass: 'nobi gkzm dgsy scns' // PASSWORD APP
  }
});

// TEST EMAIL ALL'AVVIO (IMPORTANTISSIMO)
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ ERRORE SMTP:", err);
  } else {
    console.log("✅ SMTP Gmail collegato correttamente");
  }
});

// 🔐 FORGOT PASSWORD
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!users[email]) {
    return res.json({ success: false, message: "Email non trovata" });
  }

  const token = crypto.randomBytes(20).toString('hex');
  resetTokens[token] = email;

  const link = `https://company-ai-portal-static.vercel.app/reset-password.html?token=${token}`;

  console.log("==============================");
  console.log("RICHIESTA RESET PASSWORD");
  console.log("Email:", email);
  console.log("Link:", link);
  console.log("==============================");

  transporter.sendMail({
    from: 'AI Portal <a78335323@gmail.com>',
    to: email,
    subject: 'Reset Password',
    text: `Clicca qui per reimpostare la password:\n\n${link}`
  }).then(() => {
    res.json({ success: true, message: "Link inviato via mail!" });
  }).catch(err => {
    console.error(err);
    res.json({ success: false, error: err.message });
  });
});


app.listen(3000, () => {
  console.log("🚀 Backend attivo su porta 3000");
});
