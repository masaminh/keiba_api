import fs from 'fs';
import { DateTime } from 'luxon';
import GetRaces from './get_races';
import Storage from './storage';

describe('get_races', () => {
  test('Race result', async () => {
    Storage.getKeys = jest
      .fn()
      .mockResolvedValue(['jbis/race/calendar/20200105/106']);

    const body = fs.readFileSync('testdata/GetRace_Result_1', 'utf-8');
    Storage.getContentString = jest.fn().mockResolvedValue(body);
    const races = await GetRaces(DateTime.fromISO('2020-01-05'));
    const race = races.find((x) => x.id === '2020010510611');
    expect(race).toEqual({
      id: '2020010510611',
      courseid: '106',
      coursename: '中山',
      racenumber: 11,
      racename: '中山金杯',
    });
  });
});
