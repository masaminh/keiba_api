import fs from 'fs';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import GetRaceDetail from './get_racedetail';
import Storage from './storage';

describe('get_racedetail', () => {
  test.each`
    file                                 | message
    ${'testdata/GetRaceDetail_Entry_1'}  | ${'Race Entry'}
    ${'testdata/GetRaceDetail_Result_1'} | ${'Race Result'}
  `('GetRaceDetail: $message', async ({ file }) => {
    const expected = {
      id: '2021062010511', courseid: '105', coursename: '東京', racenumber: 11, racename: 'ユニコーンＳ',
    };
    const expectedNum = 16;

    const body = fs.readFileSync(file, 'utf-8');
    Storage.getContentString = jest.fn().mockReturnValue(TE.right(body));
    const result = await GetRaceDetail(expected.id)();

    expect((result as any).right.raceinfo).toEqual(expected);
    expect((result as any).right.horses?.length).toEqual(expectedNum);
  });

  test.each`
    code           | status | message
    ${'NoSuchKey'} | ${404} | ${'Race Entry'}
    ${'ERROR'}     | ${500} | ${'Race Result'}
  `('GetRaceDetail: $message', async ({ code, status }) => {
    Storage.getContentString = jest.fn().mockReturnValue(TE.left(code));
    const result = await GetRaceDetail('2021062010513')();
    expect(E.isLeft(result)).toBe(true);

    if (E.isRight(result)) {
      return;
    }

    expect(result.left).toEqual(status);
  });
});
