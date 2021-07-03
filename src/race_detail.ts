import cheerio from 'cheerio';
import Course from './course';
import { RaceDetail, HorseInRace } from './models';

export default abstract class {
  private key: string;

  protected $: cheerio.Root;

  public constructor(key: string, body: cheerio.Root) {
    this.key = key;
    this.$ = body;
  }

  protected abstract getRaceName(): string;

  protected abstract getHorse(elm: cheerio.Element): HorseInRace;

  public getRaceDetail(): RaceDetail {
    const m = this.key.match(/^jbis\/race\/(\d{8})\/(\d{3})\/(\d{2}).htm$/);
    if (m == null) {
      throw Error();
    }
    const raceid = `${m[1]}${m[2]}${m[3]}`;
    const courseid = m[2];
    const coursename = Course.Id2Name(courseid);
    const racenumber = Number(m[3]);
    const racename = this.getRaceName();
    return {
      raceinfo: {
        id: raceid,
        courseid,
        coursename,
        racenumber,
        racename,
      },
      horses: this.$('.tbl-data-04 tbody tr')
        .map((_, elm) => {
          return this.getHorse(elm);
        })
        .get() as HorseInRace[],
    };
  }

  protected getNumberOrUndefined(
    selector: string,
    elm: cheerio.Element
  ): number | undefined {
    const text = this.$(selector, elm).text().trim();
    return text.match(/^\d+$/) ? Number(text) : undefined;
  }
}
