import { DateTime } from 'luxon';
import cheerio from 'cheerio';
import * as models from './models';
import RaceListFactory from './race_list_factory';
import Storage from './storage';

type Race = models.definitions['Race'];

const raceCalendarPrefix = 'jbis/race/calendar/';

export default async (date: DateTime): Promise<Race[]> => {
  // 指定日の場ごとのファイル一覧を取得
  const keys = await Storage.getKeys(
    raceCalendarPrefix + date.toFormat('yyyyMMdd'),
  );

  const result = await Promise.all(
    keys.map(async (key) => {
      // 指定日の場ごとのファイルの処理
      const body = await Storage.getContentString(key, 'windows-31j');
      const $ = cheerio.load(body);

      const raceList = RaceListFactory.create(key, $);
      return raceList.getRaces();
    }),
  );

  return ([] as Race[]).concat(...result);
};
