// import winston from 'winston';
// import morgan from 'morgan';

// const transports = [
//   new winston.transports.Console({
//     level: 'info',
//     format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
//   }),
// ];

// export const logger = winston.createLogger({
//   transports,
// });

import winston from 'winston';
import morgan from 'morgan';

// ':method :url :status :res[content-length] - :response-time ms'
const morganMiddleware = morgan(':method :url :status - :response-time ms', {
  stream: {
    // Configure Morgan to use our custom logger with the http severity
    write: (message) => logger.http(message.trim()),
  },
});

const {
  format: { combine, timestamp, simple, colorize }, //json
} = winston;
export const logger = winston.createLogger({
  level: 'http',
  format: combine(
    colorize(),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss A',
    }),
    // json()
    simple()
  ),
  transports: [new winston.transports.Console()],
});

export { morganMiddleware };
