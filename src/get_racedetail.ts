import cheerio from 'cheerio';
import * as models from './models';
import Storage from './storage';
import RaceDetailFactory from './race_detail_factory';

type RaceDetail = models.definitions['RaceDetail'];

export default async (raceid: string): Promise<RaceDetail> => {
  const datestr = raceid.substring(0, 8);
  const courseid = raceid.substring(8, 11);
  const racenumberstr = raceid.substring(11, 13);
  const key = `jbis/race/${datestr}/${courseid}/${racenumberstr}.htm`;
  const body = await Storage.getContentString(key, 'windows-31j');
  const $ = cheerio.load(body);
  const raceDetailObject = RaceDetailFactory.create(raceid, $);
  return raceDetailObject.getRaceDetail();
};
