import express from 'express';
import { DateTime } from 'luxon';
import getRaces from './get_races';
import getRaceDetail from './get_racedetail';
import Log from './log';

const logger = Log.getLogger();

const app = express();
app.disable('x-powered-by');

app.get('/v1/races', async (req, res) => {
  // TODO: パラメータチェック必要
  const path = '/v1/races';
  logger.info('api start', { params: { path, req } });
  const dateString = req.query.date as string;
  const date = DateTime.fromISO(dateString);
  const races = await getRaces(date);
  res.json(races);
  logger.info('api end', { params: { path } });
});

app.get('/v1/races/:raceid/detail', async (req, res) => {
  const path = '/v1/races/:raceid/detail';
  logger.info('api start', { params: { path, req } });
  const raceDetail = await getRaceDetail(req.params.raceid);
  res.json(raceDetail);
  logger.info('api end', { params: { path } });
});

export default app;
