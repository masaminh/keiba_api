import getRaces from './get_races';
import express = require('express');
import moment = require('moment');

const app = express();

app.get('/v1/races', async (req, res) => {
  // TODO: パラメータチェック必要
  const dateString = req.query.date as string;
  const date = moment(dateString, ['YYYY-MM-DD']);
  const races = await getRaces(date);
  res.json(races);
});

module.exports = app;
