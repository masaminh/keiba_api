import express = require('express');
import aws = require('aws-sdk');
import cheerio = require('cheerio');
import iconv = require('iconv-lite');
import moment = require('moment');
import dotenv = require('dotenv');

dotenv.config();

const region = process.env.REGION ?? '';
const bucket = process.env.BUCKET ?? '';
const raceCalendarPrefix = 'jbis/race/calendar/';

const s3 = new aws.S3({ apiVersion: '2006-03-01', region });

const courseId2courseName = new Map([
  ['101', '札幌'],
  ['102', '函館'],
  ['103', '福島'],
  ['104', '新潟'],
  ['105', '東京'],
  ['106', '中山'],
  ['107', '中京'],
  ['108', '京都'],
  ['109', '阪神'],
  ['110', '小倉'],
  ['236', '門別'],
  ['210', '盛岡'],
  ['211', '水沢'],
  ['218', '浦和'],
  ['219', '船橋'],
  ['220', '大井'],
  ['221', '川崎'],
  ['222', '金沢'],
  ['223', '笠松'],
  ['224', '名古屋'],
  ['227', '園田'],
  ['228', '姫路'],
  ['231', '高知'],
  ['232', '佐賀']
]);

interface Race {
  id: string;
  courseid: string;
  coursename: string;
  racenumber: number;
  racename: string;
}

const getRaces = async (date: moment.Moment): Promise<Race[]> => {
  const listParams = {
    Bucket: bucket,
    Prefix: raceCalendarPrefix + date.format('YYYYMMDD')
  };

  // 指定日の場ごとのファイル一覧を取得
  const objectsInfo = await s3.listObjectsV2(listParams).promise();
  const keys: string[] =
    objectsInfo.Contents?.map(x => x.Key ?? '')?.filter(x => x !== '') ?? [];

  const result = await Promise.all(
    keys.map(async key => {
      // 指定日の場ごとのファイルの処理
      const courseId = key.split('/').slice(-1)[0];
      const obj = await s3.getObject({ Bucket: bucket, Key: key }).promise();

      const body = iconv.decode(obj.Body as Buffer, 'windows-31j');

      const $ = cheerio.load(body);
      const raceInfos = $('.tbl-data-04 tbody tr')
        .map((idx, elm) => {
          const number = Number($('th', elm).text());
          const name = $('td:first-of-type > a', elm).text();
          const raceInfo: Race = {
            id: date.format('YYYYMMDD') + courseId + `0${number}`.slice(-2),
            courseid: courseId,
            coursename: courseId2courseName.get(courseId) ?? '',
            racenumber: number,
            racename: name
          };

          return raceInfo;
        })
        .get()
        .map(x => x as Race);

      return raceInfos;
    })
  );

  const races = ([] as Race[]).concat(...result);

  /*
  const races = [
    {
      id: '2019122210611',
      courseid: '106',
      coursename: '中山',
      number: 11,
      name: '有馬記念'
    }
  ]
*/
  return races;
};

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
  const date = moment.utc(req.query.date).local();
  const races = await getRaces(date);
  res.json(races);
});

const port = '8080';
app.listen(port, () => {
  console.log(`app start listening on port ${port}`);
});
