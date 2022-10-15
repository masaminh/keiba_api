import serverlessExpress from '@vendia/serverless-express';
import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import middy from '@middy/core';
import app from './app';
import Log from './log';

// eslint-disable-next-line import/prefer-default-export
export const handler = middy(serverlessExpress({ app })).use(injectLambdaContext(Log.getLogger()));
