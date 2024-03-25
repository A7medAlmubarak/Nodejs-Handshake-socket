const winston = require('winston');
const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: './logs/app.log',
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
  exitOnError: false,
});
const requestLogger = (req, res, next) => {
  res.on('finish', () => {
    winstonLogger.info({
      timestamp: new Date(),
      method: req.method,
      url: req.originalUrl,
      //requestBody: req.body,
      responseMessage: res.statusMessage,
      statusCode: res.statusCode, 

      userAgent: req.headers['user-agent'],
      content_type: req.headers['content-type'],
    });
  });
  next();
};
const errorLogger = (err, req, res, next) => {
  res.on('finish', () => {
    winstonLogger.log('error', {
      timestamp: new Date(),
      method: req.method,
      url: req.originalUrl,
      error: err.message,
      requestBody: req.body,
      userAgent: req.headers['user-agent'],
      content_type: req.headers['content-type'],
      statusCode: res.statusCode, // Include the status code
    });
  });
  next(err);
};
module.exports = { winstonLogger, requestLogger, errorLogger };
