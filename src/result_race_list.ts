import cheerio from 'cheerio';
import RaceList from './race_list';

type Cheerio = ReturnType<typeof cheerio.load>;

export default class extends RaceList {
  protected getRaceNumber(elm: cheerio.Element): number {
    const raceNumber = Number(this.$('th', elm).text());
    return raceNumber;
  }

  protected getRaceName(elm: cheerio.Element): string {
    const raceName = this.$('td:first-of-type a', elm).text();
    return raceName;
  }
}
