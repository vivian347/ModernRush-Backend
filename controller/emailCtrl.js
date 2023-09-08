const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const asyncHandler = require('express-async-handler');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASSWORD,
    },
});

const sendMail = asyncHandler(async (data, req, res) => {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: { name: 'Hey 👻', address: process.env.MAIL_ID }, // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.html, // html body
    });
    console.log('Email has been sent successfully');
});

module.exports = { sendMail };