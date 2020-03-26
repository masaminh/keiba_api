import cheerio from 'cheerio';
import Race from './race';
import Course from './course';

type Cheerio = ReturnType<typeof cheerio.load>;

export default abstract class RaceList {
  private key: string;

  protected $: CheerioStatic;

  public constructor(key: string, body: CheerioStatic) {
    this.key = key;
    this.$ = body;
  }

  protected abstract getRaceNumber(elm: CheerioElement): number;

  protected abstract getRaceName(elm: CheerioElement): string;

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
          racename: name
        };

        return race;
      })
      .get()
      .map(x => x as Race);

    return races;
  }
}
