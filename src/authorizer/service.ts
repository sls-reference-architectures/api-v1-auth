import Logger from '@dazn/lambda-powertools-logger';
import { PolicyDocument } from 'aws-lambda';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import jwt from 'jsonwebtoken';

const getPolicy = async (input: { methodArn: string; authorizationToken: string }) => {
  Logger.debug('In service.authorize()', { input }); // TODO: stop logging input --SRO
  const { methodArn, authorizationToken } = input;
  const clientId = getClientId(authorizationToken);
  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.USER_POOL_ID ?? '',
    clientId,
    tokenUse: 'access',
  });
  try {
    const payload = await verifier.verify(authorizationToken);
    Logger.debug('Temporary trace: authorized', { payload });

    return generatePolicy({ effect: 'Allow', resource: methodArn });
  } catch (err) {
    Logger.debug('Temporary trace: unauthorized');

    throw Error('Unauthorized'); // This becomes 401/Unauthorized in API Gateway
  }
};

const getClientId = (authToken: string): string => {
  const minusTheBear = authToken.split('Bearer ')[1];
  console.log(minusTheBear);
  const decoded: any = jwt.decode(minusTheBear, { complete: true });
  if (!decoded) {
    throw new Error('Cannot parse authToken');
  }

  return decoded.payload.client_id;
};

const generatePolicy = (input: { effect: string; resource: string }): PolicyDocument => {
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
