const nodemailer = require('nodemailer');

let mailConfig = nodemailer.createTransport({
    service:'gmail',
    auth:{
        "user":"abrahamgreatebele@gmail.com",
        "pass":"mdpgrlugcxhtlkah"
    }
});

module.exports = mailConfig;