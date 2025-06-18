import {
  getStack,
  getRestServiceEndpoint,
  getUserPoolId,
  getTestToken,
  getApiKey,
} from './setupUtils';

const region = process.env.AWS_REGION || 'us-east-1';
const stage = process.env.STAGE || 'dev';

const setup = async () => {
  const stackName = `api-v1-auth-${stage}`;
  const stack = await getStack(stackName);
  const serviceUrl = getRestServiceEndpoint(stack);
  const userPoolId = getUserPoolId(stack);
  const { accessToken: fullAccessToken } = await getTestToken(stack);
  const testApiKey = await getApiKey('IntegrationTestClient');

  process.env.AWS_REGION = region;
  process.env.STAGE = stage;
  process.env.NODE_ENV = stage;
  process.env.API_URL = serviceUrl;
  process.env.USER_POOL_ID = userPoolId;
  process.env.ACCESS_TOKEN = fullAccessToken;
  process.env.API_KEY = testApiKey?.value;
};

export default setup;
