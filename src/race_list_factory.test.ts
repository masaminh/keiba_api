import fs from 'fs';
import cheerio from 'cheerio';
import RaceListFactory from './race_list_factory';
import ResultRaceList from './result_race_list';
import EntryRaceList from './entry_race_list';

describe('RaceListFactory', (): void => {
  test.each`
    key                                  | fileName                                       | expected          | message
    ${'jbis/race/calendar/20210530/105'} | ${'testdata/RaceListFactory_ResultRaceList_1'} | ${ResultRaceList} | ${'create ResultRaceList'}
    ${'jbis/race/calendar/20210606/105'} | ${'testdata/RaceListFactory_EntryRaceList_1'}  | ${EntryRaceList}  | ${'create EntryRaceList'}
  `('$message', ({ key, fileName, expected }) => {
    const body = fs.readFileSync(fileName, 'utf-8');
    const instance = RaceListFactory.create(key, cheerio.load(body));
    expect(instance).toBeInstanceOf(expected);
  });
});
