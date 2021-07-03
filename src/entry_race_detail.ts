import cheerio from 'cheerio';
import RaceDetail from './race_detail';
import { HorseInRace } from './models';

export default class extends RaceDetail {
  protected getRaceName(): string {
    return this.$('h2').text().trim();
  }

  protected getHorse(elm: cheerio.Element): HorseInRace {
    const bracketnumber = this.getNumberOrUndefined('th span', elm);
    const horsenumber = this.getNumberOrUndefined('td:first-of-type', elm);
    const horseAnchor = this.$('td:nth-of-type(2) > a', elm);
    const horsename = horseAnchor.text().replace(/\(.+\)/, '');
    const horseUrl = horseAnchor.attr().href;
    const m = horseUrl.match(/^\/horse\/(.+)\/$/);
    const horseid = m ? m[1] : undefined;

    return {
      bracketnumber,
      horsenumber,
      horseid,
      horsename,
    };
  }
}
