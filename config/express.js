// Importing necessary modules and libraries
const express = require('express');
const morgan = require('morgan');  // For logging HTTP requests
const compression = require('compression');  // For compressing response bodies
const bodyParser = require('body-parser');  // For parsing incoming request bodies
const methodOverride = require('method-override');  // For using HTTP verbs such as PUT or DELETE in places where the client doesn't support it
const session = require('express-session');  // For managing user sessions
const nodemailer = require('nodemailer');  // For sending emails

module.exports = function () {
  const app = express();

  // Checking the environment and using appropriate middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));  // In development, log requests for debugging
  } else if (process.env.NODE_ENV === 'production') {
    app.use(compression());  // In production, compress responses for faster load times
  }

  // Middleware for parsing request bodies
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Middleware for supporting HTTP verbs
  app.use(methodOverride());

  // Setting up user session configuration
  const sessionSecret='developmentSessionSecret';
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: sessionSecret  // Secret key for session
  }));

  // Setting the view engine and views directory for rendering views
  app.set('views', './app/views');
  app.set('view engine', 'ejs');

  // Including application routes`
  app.use('/', require('../app/routes/index.server.routes.js'));

  // Endpoint for sending email using Nodemailer
  app.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Setting up email configuration
    let transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: 'YOUR_EMAIL@gmail.com',  // Replace with your email
            pass: 'YOUR_PASSWORD'  // Replace with your password
        }
    });

    let mailOptions = {
        from: 'YOUR_EMAIL@gmail.com',
        to: 'RECIPIENT_EMAIL@gmail.com',  // Replace with the recipient's email
        subject: subject,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    // Attempting to send the email
    try {
        await transporter.sendMail(mailOptions);
        res.send({ status: 'Email sent successfully!' });
    } catch (error) {
        res.send({ status: 'Failed to send email.' });
    }
  });

  // Middleware for serving static files (like CSS, images, etc.)
  app.use(express.static('./public'));

  // Returning the configured app
  return app;
};
