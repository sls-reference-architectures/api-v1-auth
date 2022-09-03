import Logger from '@dazn/lambda-powertools-logger';
import { PolicyDocument } from 'aws-lambda';

const getPolicy = async (event: any) => {
  Logger.debug('In service.authorize()', { event });

  return generatePolicy({ effect: 'Allow', resource: event.methodArn });
};

const generatePolicy = (input: { effect: string, resource: string }): PolicyDocument => {
  const { effect, resource } = input;
  const policyDocument: PolicyDocument = {
    Version: '2012-10-17',
    Statement: [],
  };
  if (effect && resource) {
    policyDocument.Statement.push({
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource,
    });
  }

  return policyDocument;
};

export default getPolicy;
