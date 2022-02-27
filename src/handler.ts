import serverlessExpress from '@vendia/serverless-express';
import app from './app';

// eslint-disable-next-line import/prefer-default-export
export const handler = serverlessExpress({ app });
