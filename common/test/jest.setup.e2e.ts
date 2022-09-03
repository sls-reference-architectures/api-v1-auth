/* eslint-disable import/no-extraneous-dependencies */
import { CloudFormationClient, DescribeStacksCommand, Stack } from '@aws-sdk/client-cloudformation';
// import { CognitoIdentityProviderClient, DescribeUserPoolClientCommand } from '@aws-sdk/client-cognito-identity-provider';

const region = process.env.AWS_REGION || 'us-east-1';
const stage = process.env.STAGE || 'dev';

const setup = async (): Promise<void> => {
  const stackName = `api-v1-auth-${stage}`;

  const stack = await getStack(stackName);
  const serviceUrl = getRestServiceEndpoint(stack);

  // const testClientId = getTestClientId(stack);

  process.env.AWS_REGION = region;
  process.env.STAGE = stage;
  process.env.NODE_ENV = stage;
  process.env.API_URL = serviceUrl;
};

const getRestServiceEndpoint = (stack: Stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'ServiceEndpoint')?.OutputValue;

// const getUserPoolId = (stack: Stack) => stack.Outputs?.find((o) => o.OutputKey === 'ApiV1AuthUserPoolId')?.OutputValue;

// const getTestClientId = async (stack: Stack) => {
//   const userPoolId = getUserPoolId(stack);
//   const client = new CognitoIdentityProviderClient({ region });
//   const wat = await client.send(new DescribeUserPoolClientCommand({
//     UserPoolId: userPoolId,

//   }))
// };

const getStack = async (stackName: string): Promise<Stack> => {
  const cfn = new CloudFormationClient({ region });
  const stackResult = await cfn.send(new DescribeStacksCommand({ StackName: stackName }));
  const stack = stackResult.Stacks?.[0];
  if (!stack) {
    throw new Error(`Couldn't find stack with name ${stackName}`);
  }

  return stack;
};

export default setup;
