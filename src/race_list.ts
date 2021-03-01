import cheerio from 'cheerio';
import { Race } from './models';
import Course from './course';

export default abstract class RaceList {
  private key: string;

  protected $: cheerio.Root;

  public constructor(key: string, body: cheerio.Root) {
    this.key = key;
    this.$ = body;
  }

  protected abstract getRaceNumber(elm: cheerio.Element): number;

  protected abstract getRaceName(elm: cheerio.Element): string;

  public getRaces(): Race[] {
    const splittedKey = this.key.split('/');
    const dateString = splittedKey.slice(-2, -1)[0];
    const courseId = splittedKey.slice(-1)[0];

    const races: Race[] = this.$('.tbl-data-04 tbody tr')
      .map((idx, elm) => {
        const number = this.getRaceNumber(elm);
        const name = this.getRaceName(elm);
        const race: Race = {
          id: dateString + courseId + `0${number}`.slice(-2),
          courseid: courseId,
          coursename: Course.Id2Name(courseId),
          racenumber: number,
          racename: name,
        };

        return race;
      })
      .get()
      .map((x) => x as Race);

    return races;
  }
}
