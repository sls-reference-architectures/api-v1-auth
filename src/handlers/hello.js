import middy from '@middy/core';
import ioLogger from '@middy/input-output-logger';
import jsonBodyParser from '@middy/http-json-body-parser';

import ioLoggerConfig from '../common/middyIoLoggerConfiguration';

const getMessage = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World!', event }),
  };
};

const createMessage = async (event) => {
  const {
    body: { name },
  } = event;

  return {
    statusCode: 201,
    body: JSON.stringify({ message: `Hello ${name}!` }),
  };
};

export const getMessageHandler = middy()
  .use(ioLogger(ioLoggerConfig('V1Auth')))
  .handler(getMessage);
export const createMessageHandler = middy()
  .use(jsonBodyParser())
  .use(ioLogger(ioLoggerConfig('V1Auth')))
  .handler(createMessage);
