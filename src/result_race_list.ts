import cheerio from 'cheerio';
import RaceList from './race_list';

export default class extends RaceList {
  protected getRaceNumber(elm: cheerio.Element): number {
    return Number(this.$('th', elm).text());
  }

  protected getRaceName(elm: cheerio.Element): string {
    return this.$('td:first-of-type a', elm).text();
  }
}
