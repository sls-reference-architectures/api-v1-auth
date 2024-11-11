/* eslint-disable import/no-extraneous-dependencies */
import { getStack, getTestToken, getUserPoolId } from './setupUtils';

const region = process.env.AWS_REGION || 'us-east-1';
const stage = process.env.STAGE || 'dev';

const setup = async () => {
  const stackName = `api-v1-auth-${stage}`;

  const stack = await getStack(stackName);
  const userPoolId = getUserPoolId(stack);
  const { accessToken } = await getTestToken(stack);

  process.env.AWS_REGION = region;
  process.env.STAGE = stage;
  process.env.NODE_ENV = stage;
  process.env.USER_POOL_ID = userPoolId;
  process.env.ACCESS_TOKEN = accessToken;
};

export default setup;
