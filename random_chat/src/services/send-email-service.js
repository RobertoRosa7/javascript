const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'kakashi.kisura7@gmail.com',
        pass: '',
    },
});
module.exports = {
    sendEmail: (payload) => {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                to: payload.req.body.email,
                from: payload.from,
                subject: payload.subject,
                text: payload.text,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (!error) resolve({ status: true, message: 'E-mail enviado com sucesso.' });
            });
        });
    },
};
