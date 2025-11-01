/**
 * Structured logging utility
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

class Logger {
  constructor(context = '') {
    this.context = context;
  }

  _formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      context: this.context,
      message,
      ...meta,
    };

    // In production, you could send this to a logging service
    // Example: send to Sentry, LogRocket, or custom endpoint
    if (process.env.NODE_ENV === 'production' && level === LOG_LEVELS.ERROR) {
      // Sentry.captureException(new Error(message), { extra: meta });
    }

    return logEntry;
  }

  error(message, meta = {}) {
    const logEntry = this._formatMessage(LOG_LEVELS.ERROR, message, meta);
    console.error(`[${logEntry.level}] ${logEntry.context}:`, message, meta);
  }

  warn(message, meta = {}) {
    const logEntry = this._formatMessage(LOG_LEVELS.WARN, message, meta);
    console.warn(`[${logEntry.level}] ${logEntry.context}:`, message, meta);
  }

  info(message, meta = {}) {
    const logEntry = this._formatMessage(LOG_LEVELS.INFO, message, meta);
    console.info(`[${logEntry.level}] ${logEntry.context}:`, message, meta);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const logEntry = this._formatMessage(LOG_LEVELS.DEBUG, message, meta);
      console.debug(`[${logEntry.level}] ${logEntry.context}:`, message, meta);
    }
  }
}

// Create logger instances for different parts of the app
export const apiLogger = new Logger('API');
export const audioLogger = new Logger('Audio');
export const stateLogger = new Logger('State');
export const uiLogger = new Logger('UI');

export default Logger;
