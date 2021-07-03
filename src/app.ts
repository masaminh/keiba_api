import express from 'express';
import { DateTime } from 'luxon';
import getRaces from './get_races';
import getRaceDetail from './get_racedetail';

const app = express();
app.disable('x-powered-by');

app.get('/v1/races', async (req, res) => {
  // TODO: パラメータチェック必要
  const dateString = req.query.date as string;
  const date = DateTime.fromISO(dateString);
  const races = await getRaces(date);
  res.json(races);
});

app.get('/v1/races/:raceid/detail', async (req, res) => {
  const raceDetail = await getRaceDetail(req.params.raceid);
  res.json(raceDetail);
});

module.exports = app;
