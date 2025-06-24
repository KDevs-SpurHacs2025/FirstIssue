import { createLogger, format, transports, addColors } from 'winston';

// Define custom colors for all log levels
const customColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'grey',
};
addColors(customColors);

const logger = createLogger({
  level: 'info',
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  format: format.combine(
    format.colorize({ all: true }), // Enable color for all levels
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/app.log', format: format.combine(format.uncolorize()) })
  ],
});

export default logger;
