/* eslint-disable import/no-extraneous-dependencies */

import {
  getStack,
  getRestServiceEndpoint,
  getUserPoolId,
  getFullAccessTestToken,
  getReadOnlyTestToken,
} from './setupUtils';

const region = process.env.AWS_REGION || 'us-east-1';
const stage = process.env.STAGE || 'dev';

const setup = async (): Promise<void> => {
  const stackName = `api-v1-auth-${stage}`;

  const stack = await getStack(stackName);
  const serviceUrl = getRestServiceEndpoint(stack);
  const userPoolId = getUserPoolId(stack);
  const { accessToken: fullAccessToken } = await getFullAccessTestToken(stack);
  const { accessToken: readAccessToken } = await getReadOnlyTestToken(stack);

  process.env.AWS_REGION = region;
  process.env.STAGE = stage;
  process.env.NODE_ENV = stage;
  process.env.API_URL = serviceUrl;
  process.env.USER_POOL_ID = userPoolId;
  process.env.FULL_ACCESS_TOKEN = fullAccessToken;
  process.env.READ_ACCESS_TOKEN = readAccessToken;
};

export default setup;
