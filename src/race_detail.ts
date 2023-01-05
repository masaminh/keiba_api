import cheerio from 'cheerio';
import Course from './course';
import * as models from './models';

type RaceDetail = models.components['schemas']['RaceDetail'];
type HorseInRace = models.components['schemas']['HorseInRace'];

export interface HorseSelectors {
  bracketNumber: string;
  horseNumber: string;
  horseAnchor: string;
}

export default abstract class {
  private raceid: string;

  protected $: cheerio.Root;

  public constructor(raceid: string, body: cheerio.Root) {
    this.raceid = raceid;
    this.$ = body;
  }

  protected abstract getRaceName(): string;

  protected abstract getHorseSelectors(): HorseSelectors;

  public getRaceDetail(): RaceDetail {
    const date = [
      this.raceid.substring(0, 4),
      this.raceid.substring(4, 6),
      this.raceid.substring(6, 8),
    ].join('-');
    const courseid = this.raceid.substring(8, 11);
    const coursename = Course.Id2Name(courseid);
    const racenumber = Number(this.raceid.substring(11, 13));
    const racename = this.getRaceName();
    return {
      raceinfo: {
        id: this.raceid,
        date,
        courseid,
        coursename,
        racenumber,
        racename,
      },
      horses: this.$('.tbl-data-04 tbody tr')
        .map((_, elm) => this.getHorse(elm))
        .get() as HorseInRace[],
    };
  }

  protected getNumberOrUndefined(
    selector: string,
    elm: cheerio.Element,
  ): number | undefined {
    const text = this.$(selector, elm).text().trim();
    return text.match(/^\d+$/) ? Number(text) : undefined;
  }

  private getHorse(elm: cheerio.Element): HorseInRace {
    const selectors = this.getHorseSelectors();
    const bracketnumber = this.getNumberOrUndefined(
      selectors.bracketNumber,
      elm,
    );
    const horsenumber = this.getNumberOrUndefined(selectors.horseNumber, elm);
    const horseAnchor = this.$(selectors.horseAnchor, elm);
    const horsename = horseAnchor.text().replace(/\([A-Z]{2,3}\)$/, '');
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
