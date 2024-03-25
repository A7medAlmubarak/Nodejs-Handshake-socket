const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const handleFormData = require('./middlewares/formDataMiddleware');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const { requestLogger, errorLogger, winstonLogger } = require('./middlewares/logging/logger');
const app = express();


// init middlewares
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true, }));
app.use(requestLogger);
app.use(errorLogger);
app.use(handleFormData);
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));


// init db
const { connection } = require("./database/config.js");
connection.sequelize.sync({alter:true})
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });


// init views
  app.set("view engine", "ejs"); // Use "ejs" or your preferred view engine
  // Specify the directory where your views are located
  app.set("views", path.join(__dirname, "views"));
  app.use(express.static(__dirname + '/public'));


// init routes
app.use('/', authRoutes);


// init handle errors
app.use((req, res, next) => {
  const error = new Error("Not Found!");
  error.status = 404;
  next(error);
});
module.exports = app;