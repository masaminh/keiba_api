import RaceDetail, { HorseSelectors } from './race_detail';

export default class extends RaceDetail {
  override getRaceName(): string {
    const rawRaceName = this.$('h2').text();
    const m = rawRaceName.match(/^\d{1,2}R\s(.+)/);
    return (m ? m[1] : rawRaceName).trim();
  }

  // eslint-disable-next-line class-methods-use-this
  override getHorseSelectors(): HorseSelectors {
    return {
      bracketNumber: 'td:first-of-type',
      horseNumber: 'td:nth-of-type(2)',
      horseAnchor: 'td:nth-of-type(3) > a',
    };
  }
}
