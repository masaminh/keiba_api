import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger({
  logLevel: 'INFO',
  serviceName: 'keiba_api',
});

namespace Log {
  export function getLogger(): Logger {
    return logger;
  }
}

export default Log;
