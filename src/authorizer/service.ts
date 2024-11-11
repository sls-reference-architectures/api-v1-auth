import Logger from '@dazn/lambda-powertools-logger';
import { PolicyDocument } from 'aws-lambda';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import jwt from 'jsonwebtoken';

const getPolicy = async (input: { methodArn: string; authHeaderValue: string }) => {
  Logger.debug('In service.authorize()', { input }); // TODO: stop logging input --SRO
  const { methodArn, authHeaderValue } = input;
  try {
    const authToken = getTokenFromAuthHeaderValue(authHeaderValue);
    const clientId = getClientId(authToken);
    const verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.USER_POOL_ID ?? '',
      clientId,
      tokenUse: 'access',
    });
    const payload = await verifier.verify(authToken);
    Logger.debug('Temporary trace: authorized', { payload });

    return generatePolicy({ effect: 'Allow', resource: methodArn });
  } catch (err) {
    const error = err as Error;
    Logger.debug('Temporary trace: unauthorized', { errMsg: error.message });

    throw Error('Unauthorized'); // This becomes 401/Unauthorized in API Gateway
  }
};

const getClientId = (authToken: string): string => {
  const decoded: any = jwt.decode(authToken, { complete: true });
  if (!decoded) {
    throw new Error('Cannot parse authToken');
  }

  return decoded.payload.client_id;
};

const getTokenFromAuthHeaderValue = (authHeaderValue: string): string => {
  const minusTheBear = authHeaderValue.split('Bearer ')[1];

  return minusTheBear;
};

const generatePolicy = (input: { effect: any; resource: string }): PolicyDocument => {
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
