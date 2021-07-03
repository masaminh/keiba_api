import cheerio from 'cheerio';
import RaceDetail from './race_detail';
import EntryRaceDetail from './entry_race_detail';
import ResultRaceDetail from './result_race_detail';

export default class {
  public static create(raceid: string, $: cheerio.Root): RaceDetail {
    const header1 = $('.tbl-data-04 thead th:first-of-type').text();
    return header1 === '枠'
      ? new EntryRaceDetail(raceid, $)
      : new ResultRaceDetail(raceid, $);
  }
}
