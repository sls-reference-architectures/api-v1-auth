import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Logger from '@dazn/lambda-powertools-logger';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';

import APIGatewayProxyEventMiddyNormalized from '../../common/types';

const getMessage = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  Logger.debug('In getMessage()', { event });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World!' }),
  };
};

const createMessage = async (
  event: APIGatewayProxyEventMiddyNormalized<CreateMessagePayload>,
): Promise<APIGatewayProxyResult> => {
  Logger.debug('In createMessage()', { event });
  const {
    body: { name },
  } = event;

  return {
    statusCode: 201,
    body: JSON.stringify({ message: `Hello ${name}!` }),
  };
};

interface CreateMessagePayload {
  name: string;
}

export const getMessageHandler = middy(getMessage);
export const createMessageHandler = middy(createMessage).use(jsonBodyParser());
