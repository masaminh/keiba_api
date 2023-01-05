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
      date: '2021-06-06',
      courseid: '105',
      coursename: '東京',
      racenumber: 11,
      racename: '安田記念',
    });
  });

  test('getRaces (no race number)', async () => {
    const key = 'jbis/race/calendar/20221109/221';
    const body = fs.readFileSync('testdata/EntryRaceList_getRace_2', 'utf-8');

    const raceList = new EntryRaceList(key, cheerio.load(body));
    const races = raceList.getRaces();
    expect(races).toHaveLength(0);
  });
});
