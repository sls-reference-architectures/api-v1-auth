import middy from '@middy/core';
import ioLogger from '@middy/input-output-logger';

import ioLoggerConfig from '../common/middyIoLoggerConfiguration';
import getPolicy from './service';

const authorize = async (event) => {
  const { methodArn, authorizationToken: authHeaderValue } = event;
  const policy = await getPolicy({ methodArn, authHeaderValue });

  return {
    principalId: 'wat',
    policyDocument: policy,
  };
};

export default middy()
  .use(ioLogger(ioLoggerConfig('V1Auth')))
  .handler(authorize);
