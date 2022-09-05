/* eslint-disable import/no-extraneous-dependencies */

import { getStack, getRestServiceEndpoint, getUserPoolId, getTestToken } from './setupUtils';

const region = process.env.AWS_REGION || 'us-east-1';
const stage = process.env.STAGE || 'dev';

const setup = async (): Promise<void> => {
  const stackName = `api-v1-auth-${stage}`;

  const stack = await getStack(stackName);
  const serviceUrl = getRestServiceEndpoint(stack);
  const userPoolId = getUserPoolId(stack);
  const { accessToken: fullAccessToken } = await getTestToken(stack);

  process.env.AWS_REGION = region;
  process.env.STAGE = stage;
  process.env.NODE_ENV = stage;
  process.env.API_URL = serviceUrl;
  process.env.USER_POOL_ID = userPoolId;
  process.env.ACCESS_TOKEN = fullAccessToken;
};

export default setup;
