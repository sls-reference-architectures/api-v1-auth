import { Logger } from '@aws-lambda-powertools/logger';

const ioLoggerConfig = (serviceName) => {
  const logger = new Logger({ serviceName });

  const config = {
    awsContext: true,
    logger: (msg) => {
      logger.debug('In I/O Logger', { msg });
    },
  };

  return config;
};

export default ioLoggerConfig;
