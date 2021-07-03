import cheerio from 'cheerio';
import { RaceDetail } from './models';
import Storage from './storage';
import RaceDetailFactory from './race_detail_factory';

export default async (raceid: string): Promise<RaceDetail> => {
  const datestr = raceid.substr(0, 8);
  const courseid = raceid.substr(8, 3);
  const racenumberstr = raceid.substr(11, 2);
  const key = `jbis/race/${datestr}/${courseid}/${racenumberstr}.htm`;
  const body = await Storage.getContentString(key, 'windows-31j');
  const $ = cheerio.load(body);
  const raceDetailObject = RaceDetailFactory.create(key, $);
  return raceDetailObject.getRaceDetail();
};
