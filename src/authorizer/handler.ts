import Logger from '@dazn/lambda-powertools-logger';
import middy from '@middy/core';

import getPolicy from './service';

const authorize = async (event: any) => {
  Logger.debug('In handler.authorize()', { event });

  return getPolicy(event); // TODO - parse out what we need from event and pass it in
};

export default middy(authorize);
