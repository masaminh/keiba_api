import express, { Request, Response, NextFunction } from 'express';
import { DateTime } from 'luxon';
import * as E from 'fp-ts/Either';
import getRaces from './get_races';
import getRaceDetail from './get_racedetail';
import Log from './log';
import Storage from './storage';

const logger = Log.getLogger();
Storage.initialize(process.env.REGION ?? '', process.env.BUCKET ?? '');

const app = express();
app.disable('x-powered-by');

function sendResponse<T>(res: Response, response: E.Either<number, T>) {
  E.fold(
    (e: number) => res.status(e).send(),
    (a: T) => res.json(a),
  )(response);
}

function asyncWrapper(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

app.get('/v1/races', asyncWrapper(async (req, res) => {
  // TODO: パラメータチェック必要
  const path = '/v1/races';
  logger.info('api start', { params: { path, req } });
  const dateString = req.query.date as string;
  const date = DateTime.fromISO(dateString);
  const races = await getRaces(date)();

  sendResponse(res, races);

  logger.info('api end', { params: { path } });
}));

app.get('/v1/races/:raceid/detail', asyncWrapper(async (req, res) => {
  const path = '/v1/races/:raceid/detail';
  logger.info('api start', { params: { path, req } });
  const raceDetail = await getRaceDetail(req.params.raceid)();

  sendResponse(res, raceDetail);

  logger.info('api end', { params: { path } });
}));

export default app;
