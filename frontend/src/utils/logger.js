/**
 * Conditional logging utility
 * Logs only in development mode to avoid cluttering production console
 */

const isDevelopment = import.meta.env.MODE === 'development'

export const logger = {
  /**
   * Log general information (development only)
   */
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },

  /**
   * Log errors (always logged)
   */
  error: (...args) => {
    console.error(...args)
  },

  /**
   * Log warnings (always logged)
   */
  warn: (...args) => {
    console.warn(...args)
  },

  /**
   * Log debug information (development only)
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args)
    }
  },

  /**
   * Log info (development only)
   */
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args)
    }
  },
}

export default logger
