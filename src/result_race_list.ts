import cheerio from 'cheerio';
import RaceList from './race_list';

export default class extends RaceList {
  protected getRaceNumber(elm: cheerio.Element): number {
    const raceNumberString = this.$('th', elm).text();

    if (raceNumberString === '') {
      // thタグがない時、raceNumberStringは空文字列になっている。
      // 同着があった時、レース内2行目はこの状態になるため、
      // 読み飛ばさせるために、NaNを返す。
      return NaN;
    }

    return Number(raceNumberString);
  }

  protected getRaceName(elm: cheerio.Element): string {
    return this.$('td:first-of-type a', elm).text();
  }
}
