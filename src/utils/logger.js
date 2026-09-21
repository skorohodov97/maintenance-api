import config from '../config/index.js';

const logLevels = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const configuredLevel = logLevels[config.logLevel] ? config.logLevel : 'info';

const writeLog = (level, message, context = {}) => {
  if (logLevels[level] < logLevels[configuredLevel]) {
    return;
  }

  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  });
  const output = level === 'error' ? process.stderr : process.stdout;

  output.write(`${entry}\n`);
};

const logger = {
  debug: (message, context) => writeLog('debug', message, context),
  info: (message, context) => writeLog('info', message, context),
  warn: (message, context) => writeLog('warn', message, context),
  error: (message, context) => writeLog('error', message, context),
};

export default logger;