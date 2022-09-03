import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Logger from '@dazn/lambda-powertools-logger';

const helloWorldHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  Logger.debug('Hello World!', { event });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World!' }),
  };
};

export default helloWorldHandler;
