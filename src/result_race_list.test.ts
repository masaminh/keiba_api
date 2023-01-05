import fs from 'fs';
import cheerio from 'cheerio';
import ResultRaceList from './result_race_list';

describe('ResultRaceList', (): void => {
  test('getRaces', () => {
    const key = 'jbis/race/calendar/20200105/106';
    const body = fs.readFileSync('testdata/ResultRaceList_getRaces_1', 'utf-8');
    const raceList = new ResultRaceList(key, cheerio.load(body));
    const races = raceList.getRaces();
    const race = races.find((x) => x.id === '2020010510611');
    expect(race).toEqual({
      id: '2020010510611',
      date: '2020-01-05',
      courseid: '106',
      coursename: '中山',
      racename: '中山金杯',
      racenumber: 11,
    });
  });

  test('getRaces (同着あり)', () => {
    const key = 'jbis/race/calendar/20221207/220';
    const body = fs.readFileSync('testdata/ResultRaceList_getRaces_2', 'utf-8');
    const raceList = new ResultRaceList(key, cheerio.load(body));
    const races = raceList.getRaces();
    expect(races).toHaveLength(12);
    const badRaceInfo = races.filter((r) => (r.racename === '' || r.racenumber === 0));
    expect(badRaceInfo).toHaveLength(0);
  });
});
