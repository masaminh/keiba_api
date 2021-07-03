import cheerio from 'cheerio';
import RaceList from './race_list';
import EntryRaceList from './entry_race_list';
import ResultRaceList from './result_race_list';

export default class {
  public static create(raceid: string, $: cheerio.Root): RaceList {
    const header2 = $('.tbl-data-04 thead th:nth-of-type(2)').text();

    let raceList: RaceList;

    if (header2 === 'レース名') {
      raceList = new ResultRaceList(raceid, $);
    } else {
      raceList = new EntryRaceList(raceid, $);
    }

    return raceList;
  }
}
