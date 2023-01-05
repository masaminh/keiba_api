import cheerio from 'cheerio';
import * as models from './models';
import Course from './course';

type Race = models.components['schemas']['Race'];

export default abstract class RaceList {
  private key: string;

  protected $: cheerio.Root;

  public constructor(key: string, body: cheerio.Root) {
    this.key = key;
    this.$ = body;
  }

  protected abstract getRaceNumber(_elm: cheerio.Element): number;

  protected abstract getRaceName(_elm: cheerio.Element): string;

  public getRaces(): Race[] {
    const splittedKey = this.key.split('/');
    const dateString = splittedKey.slice(-2, -1)[0];
    const courseId = splittedKey.slice(-1)[0];

    const date = [
      dateString.substring(0, 4),
      dateString.substring(4, 6),
      dateString.substring(6, 8),
    ].join('-');

    return this.$('.tbl-data-04 tbody tr')
      .toArray()
      .flatMap((elm) => {
        const number = this.getRaceNumber(elm);
        if (Number.isNaN(number)) {
          return [];
        }

        const name = this.getRaceName(elm);
        return [{
          id: dateString + courseId + `0${number}`.slice(-2),
          date,
          courseid: courseId,
          coursename: Course.Id2Name(courseId),
          racenumber: number,
          racename: name,
        }];
      });
  }
}
