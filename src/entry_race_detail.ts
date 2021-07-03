import RaceDetail, { HorseSelectors } from './race_detail';

export default class extends RaceDetail {
  override getRaceName(): string {
    return this.$('h2').text().trim();
  }

  // eslint-disable-next-line class-methods-use-this
  override getHorseSelectors(): HorseSelectors {
    return {
      bracketNumber: 'th span',
      horseNumber: 'td:first-of-type',
      horseAnchor: 'td:nth-of-type(2) > a',
    };
  }
}
