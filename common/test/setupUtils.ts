/* eslint-disable import/no-extraneous-dependencies */
import { CloudFormationClient, DescribeStacksCommand, Stack } from '@aws-sdk/client-cloudformation';
import {
  CognitoIdentityProviderClient,
  DescribeUserPoolClientCommand,
  DescribeUserPoolClientResponse,
} from '@aws-sdk/client-cognito-identity-provider';
import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';

const region = process.env.AWS_REGION || 'us-east-1';
const cognitoClient = new CognitoIdentityProviderClient({ region });

export const getRestServiceEndpoint = (stack: Stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'ServiceEndpoint')?.OutputValue;

export const getUserPoolId = (stack: Stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'ApiV1AuthUserPoolId')?.OutputValue;

const getFullAccessTestClientId = (stack: Stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'ApiV1AuthTestClientId')?.OutputValue ?? '';

const getReadOnlyTestClientId = (stack: Stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'ApiV1AuthReadOnlyTestClientId')?.OutputValue ?? '';

const getUserPoolDomain = (stack: Stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'ApiV1AuthUserPoolDomain')?.OutputValue ?? '';

const getFullAccessTestClientSecret = async (stack: Stack) => {
  const { UserPoolClient }: DescribeUserPoolClientResponse = await cognitoClient.send(
    new DescribeUserPoolClientCommand({
      UserPoolId: getUserPoolId(stack),
      ClientId: getFullAccessTestClientId(stack),
    }),
  );

  return UserPoolClient?.ClientSecret ?? '';
};

const getReadOnlyTestClientSecret = async (stack: Stack) => {
  const { UserPoolClient }: DescribeUserPoolClientResponse = await cognitoClient.send(
    new DescribeUserPoolClientCommand({
      UserPoolId: getUserPoolId(stack),
      ClientId: getReadOnlyTestClientId(stack),
    }),
  );

  return UserPoolClient?.ClientSecret ?? '';
};

export const getStack = async (stackName: string): Promise<Stack> => {
  const cfn = new CloudFormationClient({ region });
  const stackResult = await cfn.send(new DescribeStacksCommand({ StackName: stackName }));
  const stack = stackResult.Stacks?.[0];
  if (!stack) {
    throw new Error(`Couldn't find stack with name ${stackName}`);
  }

  return stack;
};

export const getFullAccessTestToken = async (stack: Stack): Promise<AccessToken> => {
  const clientId = getFullAccessTestClientId(stack);
  const clientSecret = await getFullAccessTestClientSecret(stack);
  const userPoolDomain = getUserPoolDomain(stack);
  // const body = { grant_type: 'client_credentials' };
  // const options: AxiosRequestConfig = {
  //   auth: {
  //     username: testClientId,
  //     password: testClientSecret,
  //   },
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  //   baseURL: `https://${userPoolDomain}.auth.${region}.amazoncognito.com`,
  // };
  // const {
  //   data: { access_token: accessToken, expires_in: expiresIn, token_type: tokenType },
  // } = await axios.post('/oauth2/token', qs.stringify(body), options);

  // return { accessToken, expiresIn, tokenType };

  return getToken({ clientId, clientSecret, userPoolDomain });
};

export const getReadOnlyTestToken = async (stack: Stack): Promise<AccessToken> => {
  const clientId = getReadOnlyTestClientId(stack);
  const clientSecret = await getReadOnlyTestClientSecret(stack);
  const userPoolDomain = getUserPoolDomain(stack);
  // const body = { grant_type: 'client_credentials' };
  // const options: AxiosRequestConfig = {
  //   auth: {
  //     username: testClientId,
  //     password: testClientSecret,
  //   },
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  //   baseURL: `https://${userPoolDomain}.auth.${region}.amazoncognito.com`,
  // };
  // const {
  //   data: { access_token: accessToken, expires_in: expiresIn, token_type: tokenType },
  // } = await axios.post('/oauth2/token', qs.stringify(body), options);

  // return { accessToken, expiresIn, tokenType };

  return getToken({ clientId, clientSecret, userPoolDomain });
};

const getToken = async (input: {
  clientId: string;
  clientSecret: string;
  userPoolDomain: string;
}) => {
  const { clientId, clientSecret, userPoolDomain } = input;
  const body = { grant_type: 'client_credentials' };
  const options: AxiosRequestConfig = {
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

  return { accessToken, expiresIn, tokenType };
};

interface AccessToken {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}
