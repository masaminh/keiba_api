import fs from 'fs';
import cheerio from 'cheerio';
import EntryRaceDetail from './entry_race_detail';

describe('EntryRaceDetail', (): void => {
  test.each`
    message         | raceid             | file                                          | expectedRace                                                                                              | targetHorsePos | expectedHorse
    ${'馬番発表前'} | ${'2021062010511'} | ${'testdata/EntryRaceDetail_getRaceDetail_1'} | ${{
  id: '2021062010511', courseid: '105', coursename: '東京', racenumber: 11, racename: 'ユニコーンＳ',
}} | ${0}           | ${{
  bracketnumber: undefined, horsenumber: undefined, horsename: 'イグナイター', horseid: '0001261958',
}}
    ${'馬番発表後'} | ${'2021062710911'} | ${'testdata/EntryRaceDetail_getRaceDetail_2'} | ${{
  id: '2021062710911', courseid: '109', coursename: '阪神', racenumber: 11, racename: '宝塚記念',
}}     | ${0}           | ${{
  bracketnumber: 1, horsenumber: 1, horsename: 'ユニコーンライオン', horseid: '0001295861',
}}
  `(
    'getRaceDetail ($message)',
    ({
      raceid, file, expectedRace, targetHorsePos, expectedHorse,
    }) => {
      const body = fs.readFileSync(file, 'utf-8');

      const raceDetailInstance = new EntryRaceDetail(
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
