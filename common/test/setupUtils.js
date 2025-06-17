/* eslint-disable import/no-extraneous-dependencies */
import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';
import {
  CognitoIdentityProviderClient,
  DescribeUserPoolClientCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayClient, GetApiKeysCommand } from '@aws-sdk/client-api-gateway';
import axios from 'axios';
import qs from 'qs';
import retry from 'async-retry';

const region = process.env.AWS_REGION || 'us-east-1';
const cognitoClient = new CognitoIdentityProviderClient({ region });
const apiGatewayClient = new APIGatewayClient({ region });

export const getRestServiceEndpoint = (stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'ServiceEndpoint')?.OutputValue;

export const getUserPoolId = (stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'ApiV1AuthUserPoolId')?.OutputValue;

const getTestClientId = (stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'ApiV1AuthTestClientId')?.OutputValue ?? '';

const getUserPoolDomain = (stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'ApiV1AuthUserPoolDomain')?.OutputValue ?? '';

export const getApiKey = async (name) => {
  const result = await retry(
    async () => {
      const input = {
        nameQuery: name,
        includeValues: true,
      };
      const { items } = await apiGatewayClient.send(new GetApiKeysCommand(input));
      const apiKey = items?.[0];
      if (!apiKey) {
        throw new Error(`API key with name "${name}" not found`);
      }

      return apiKey;
    },
    { retries: 3 },
  );

  return result;
};

const getTestClientSecret = async (stack) => {
  const { UserPoolClient } = await cognitoClient.send(
    new DescribeUserPoolClientCommand({
      UserPoolId: getUserPoolId(stack),
      ClientId: getTestClientId(stack),
    }),
  );

  return UserPoolClient?.ClientSecret ?? '';
};

export const getStack = async (stackName) => {
  const cfn = new CloudFormationClient({ region });
  const stackResult = await cfn.send(new DescribeStacksCommand({ StackName: stackName }));
  const stack = stackResult.Stacks?.[0];
  if (!stack) {
    throw new Error(`Couldn't find stack with name ${stackName}`);
  }

  return stack;
};

export const getTestToken = async (stack) => {
  const token = await retry(
    async () => {
      const clientId = getTestClientId(stack);
      const clientSecret = await getTestClientSecret(stack);
      const userPoolDomain = getUserPoolDomain(stack);

      return getToken({ clientId, clientSecret, userPoolDomain });
    },
    { retries: 3 },
  );

  return token;
};

const getToken = async ({ clientId, clientSecret, userPoolDomain }) => {
  const body = { grant_type: 'client_credentials' };
  const options = {
    auth: {
      username: clientId,
      password: clientSecret,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    baseURL: `https://${userPoolDomain}.auth.${region}.amazoncognito.com`,
  };
  const {
    data: { access_token: accessToken, expires_in: expiresIn, token_type: tokenType },
  } = await axios.post('/oauth2/token', qs.stringify(body), options);
  if (!accessToken || !expiresIn || !tokenType) {
    throw new Error('Failed to retrieve access token');
  }

  return { accessToken, expiresIn, tokenType };
};
