const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'a78335323@gmail.com',       // la tua email reale
        pass: 'yjou zyjb rusq osxy'        // la password APP generata da Google
    }
});

transporter.sendMail({
    from: 'AI Portal <a78335323@gmail.com>',
    to: 'a78335323@gmail.com',             // destinatario (puoi usare te stesso)
    subject: 'Test invio mail',
    text: 'Funziona!'
}).then(() => console.log('✅ Mail inviata correttamente!'))
  .catch(err => console.error('❌ Errore invio mail:', err));
