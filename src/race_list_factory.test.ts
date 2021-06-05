import fs from 'fs';
import cheerio from 'cheerio';
import RaceListFactory from './race_list_factory';
import ResultRaceList from './result_race_list';
import EntryRaceList from './entry_race_list';

describe('RaceListFactory', (): void => {
  test('create ResultRaceList', (): void => {
    const key = 'jbis/race/calendar/20210530/105';
    const body = fs.readFileSync(
      'testdata/RaceListFactory_ResultRaceList_1',
      'utf-8'
    );
    const instance = RaceListFactory.create(key, cheerio.load(body));
    expect(instance).toBeInstanceOf(ResultRaceList);
  });

  test('create EntryRaceList', (): void => {
    const key = 'jbis/race/calendar/20210606/105';
    const body = fs.readFileSync(
      'testdata/RaceListFactory_EntryRaceList_1',
      'utf-8'
    );
    const instance = RaceListFactory.create(key, cheerio.load(body));
    expect(instance).toBeInstanceOf(EntryRaceList);
  });
});
