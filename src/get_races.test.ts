import fs from 'fs';
import { DateTime } from 'luxon';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import GetRaces from './get_races';
import Storage from './storage';

describe('get_races', () => {
  test('Race result', async () => {
    Storage.getKeys = jest
      .fn()
      .mockReturnValue(TE.right(['jbis/race/calendar/20200105/106']));

    const body = fs.readFileSync('testdata/GetRace_Result_1', 'utf-8');
    Storage.getContentString = jest.fn().mockReturnValue(TE.right(body));
    const races = await GetRaces(DateTime.fromISO('2020-01-05'))();
    expect(E.isRight(races)).toBe(true);

    if (E.isLeft(races)) {
      return;
    }

    const race = races.right.find((x) => x.id === '2020010510611');
    expect(race).toEqual({
      id: '2020010510611',
      courseid: '106',
      coursename: '中山',
      racenumber: 11,
      racename: '中山金杯',
    });
  });

  test('GetRaces: getKeysでエラー発生', async () => {
    Storage.getKeys = jest.fn().mockReturnValue(TE.left('ERROR'));

    const races = await GetRaces(DateTime.fromISO('2020-01-05'))();

    expect(E.isLeft(races)).toBe(true);

    if (E.isRight(races)) {
      return;
    }

    expect(races.left).toBe(500);
  });
});
