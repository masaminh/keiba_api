import getRaces from './get_races';

import express = require('express');
import moment = require('moment');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/v1/races', async (req, res) => {
  // TODO: パラメータチェック必要
  const date = moment(req.query.date, ['YYYY-MM-DD']);
  const races = await getRaces(date);
  res.json(races);
});

const port = '8080';
app.listen(port, () => {
  console.log(`app start listening on port ${port}`); // eslint-disable-line
});
