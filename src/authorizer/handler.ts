import Logger from '@dazn/lambda-powertools-logger';
import middy from '@middy/core';
import { AuthResponse } from 'aws-lambda';

import getPolicy from './service';

const authorize = async (event: any): Promise<AuthResponse> => {
  Logger.debug('In handler.authorize()', { event });
  const { methodArn, authorizationToken: authHeaderValue } = event;
  const policy = await getPolicy({ methodArn, authHeaderValue });

  return {
    principalId: 'wat',
    policyDocument: policy,
  };
};

export default middy(authorize);
