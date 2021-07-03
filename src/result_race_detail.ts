import cheerio from 'cheerio';
import RaceDetail from './race_detail';
import { HorseInRace } from './models';

export default class extends RaceDetail {
  protected getRaceName(): string {
    const rawRaceName = this.$('h2').text();
    const m = rawRaceName.match(/^\d{1,2}R\s(.+)/);
    return (m ? m[1] : rawRaceName).trim();
  }

  protected getHorse(elm: cheerio.Element): HorseInRace {
    const bracketnumber = this.getNumberOrUndefined('td:first-of-type', elm);
    const horsenumber = this.getNumberOrUndefined('td:nth-of-type(2)', elm);
    const horseAnchor = this.$('td:nth-of-type(3) > a', elm);
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
