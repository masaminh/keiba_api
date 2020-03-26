import moment from 'moment';
import cheerio from 'cheerio';
import Race from './race';
import RaceListFactory from './race_list_factory';
import Storage from './storage';

const raceCalendarPrefix = 'jbis/race/calendar/';

export default async function(date: moment.Moment): Promise<Race[]> {
  // 指定日の場ごとのファイル一覧を取得
  const keys = await Storage.getKeys(
    raceCalendarPrefix + date.format('YYYYMMDD')
  );

  const result = await Promise.all(
    keys.map(async key => {
      // 指定日の場ごとのファイルの処理
      const body = await Storage.getContentString(key, 'windows-31j');
      const $ = cheerio.load(body);

      const raceList = RaceListFactory.create(key, $);
      const races = raceList.getRaces();

      return races;
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
}
