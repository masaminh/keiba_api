import fs from 'fs';
import cheerio from 'cheerio';
import EntryRaceList from './entry_race_list';

describe('EntryRaceList', (): void => {
  test('getRaces', async () => {
    const key = 'jbis/race/calendar/20210606/105';
    const body = fs.readFileSync('testdata/EntryRaceList_getRace_1', 'utf-8');

    const raceList = new EntryRaceList(key, cheerio.load(body));
    const races = raceList.getRaces();
    const race = races.find((x) => x.id === '2021060610511');
    expect(race).toEqual({
      id: '2021060610511',
      courseid: '105',
      coursename: '東京',
      racenumber: 11,
      racename: '安田記念',
    });
  });
});
