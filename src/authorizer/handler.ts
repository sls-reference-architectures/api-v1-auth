import Logger from '@dazn/lambda-powertools-logger';
import middy from '@middy/core';
import { AuthResponse } from 'aws-lambda';

import getPolicy from './service';

const authorize = async (event: any): Promise<AuthResponse> => {
  Logger.debug('In handler.authorize()', { event });
  const policy = await getPolicy(event); // TODO - parse out what we need from event and pass it in

  return {
    principalId: 'wat',
    policyDocument: policy,
  }
};

export default middy(authorize);
