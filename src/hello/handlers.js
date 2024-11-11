import Logger from '@dazn/lambda-powertools-logger';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';

const getMessage = async (event) => {
  Logger.debug('In getMessage()', { event });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World!' }),
  };
};

const createMessage = async (event) => {
  Logger.debug('In createMessage()', { event });
  const {
    body: { name },
  } = event;

  return {
    statusCode: 201,
    body: JSON.stringify({ message: `Hello ${name}!` }),
  };
};

export const getMessageHandler = middy(getMessage);
export const createMessageHandler = middy(createMessage).use(jsonBodyParser());
