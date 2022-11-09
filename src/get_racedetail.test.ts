import fs from 'fs';
import * as TE from 'fp-ts/TaskEither';
import GetRaceDetail from './get_racedetail';
import Storage from './storage';

describe('get_racedetail', () => {
  test.each`
    key                                | file                                 | expected                                                                                                  | expectedNum | message
    ${'jbis/race/20210620/105/11.htm'} | ${'testdata/GetRaceDetail_Entry_1'}  | ${{
  id: '2021062010511', courseid: '105', coursename: '東京', racenumber: 11, racename: 'ユニコーンＳ',
}} | ${16}       | ${'Race Entry'}
    ${'jbis/race/20210620/105/11.htm'} | ${'testdata/GetRaceDetail_Result_1'} | ${{
  id: '2021062010511', courseid: '105', coursename: '東京', racenumber: 11, racename: 'ユニコーンＳ',
}} | ${16}       | ${'Race Result'}
  `('$message', async ({
    key, file, expected, expectedNum,
  }) => {
    Storage.getKeys = jest.fn().mockResolvedValue([key]);

    const body = fs.readFileSync(file, 'utf-8');
    Storage.getContentString = jest.fn().mockReturnValue(TE.right(body));
    const result = await GetRaceDetail(expected.id)();

    expect((result as any).right.raceinfo).toEqual(expected);
    expect((result as any).right.horses?.length).toEqual(expectedNum);
  });
});
