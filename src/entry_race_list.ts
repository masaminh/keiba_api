import cheerio from 'cheerio';
import RaceList from './race_list';

type Cheerio = ReturnType<typeof cheerio.load>;

export default class extends RaceList {
  protected getRaceNumber(elm: CheerioElement): number {
    const raceNumber = Number(this.$('th', elm).text());
    return raceNumber;
  }

  protected getRaceName(elm: CheerioElement): string {
    const raceName = this.$('td:nth-of-type(2) a', elm).text();
    return raceName;
  }
}
