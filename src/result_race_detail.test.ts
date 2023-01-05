import fs from 'fs';
import cheerio from 'cheerio';
import ResultRaceDetail from './result_race_detail';

describe('ResultRaceDetail', (): void => {
  test.each`
    raceid             | file                                           | expectedRace                                                                                              | targetHorsePos | expectedHorse
    ${'2021062010511'} | ${'testdata/ResultRaceDetail_getRaceDetail_1'} | ${{
  id: '2021062010511', date: '2021-06-20', courseid: '105', coursename: '東京', racenumber: 11, racename: 'ユニコーンＳ',
}} | ${11}          | ${{
  bracketnumber: 3, horsenumber: 5, horsename: 'イグナイター', horseid: '0001261958',
}}
  `(
    'getRaceDetail',
    ({
      raceid, file, expectedRace, targetHorsePos, expectedHorse,
    }) => {
      const body = fs.readFileSync(file, 'utf-8');

      const raceDetailInstance = new ResultRaceDetail(
        raceid,
        cheerio.load(body),
      );
      const raceDetail = raceDetailInstance.getRaceDetail();
      expect(raceDetail.raceinfo).toEqual(expectedRace);
      expect(raceDetail.horses).toBeDefined();
      if (raceDetail.horses != null) {
        expect(raceDetail.horses[targetHorsePos]).toEqual(expectedHorse);
      }
    },
  );
});
