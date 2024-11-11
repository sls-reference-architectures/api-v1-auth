import Logger from '@dazn/lambda-powertools-logger';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import jwt from 'jsonwebtoken';

const getPolicy = async ({ methodArn, authHeaderValue }) => {
  Logger.debug('In service.authorize()', { methodArn, authHeaderValue }); // TODO: stop logging input --SRO
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
    Logger.debug('Temporary trace: unauthorized', { errMsg: err.message });

    throw Error('Unauthorized'); // This becomes 401/Unauthorized in API Gateway
  }
};

const getClientId = (authToken) => {
  const decoded = jwt.decode(authToken, { complete: true });
  if (!decoded) {
    throw new Error('Cannot parse authToken');
  }

  return decoded.payload.client_id;
};

const getTokenFromAuthHeaderValue = (authHeaderValue) => {
  const minusTheBear = authHeaderValue.split('Bearer ')[1];

  return minusTheBear;
};

const generatePolicy = ({ effect, resource }) => {
  const policyDocument = {
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
