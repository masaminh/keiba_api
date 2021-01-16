import express from 'express';
import { DateTime } from 'luxon';
import getRaces from './get_races';

const app = express();
app.disable('x-powered-by');

app.get('/v1/races', async (req, res) => {
  // TODO: パラメータチェック必要
  const dateString = req.query.date as string;
  const date = DateTime.fromISO(dateString);
  const races = await getRaces(date);
  res.json(races);
});

module.exports = app;
