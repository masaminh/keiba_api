import cheerio from 'cheerio';
import EntryRaceList from './entry_race_list';

describe('EntryRaceList', (): void => {
  test('getRaces', () => {
    const key = 'jbis/race/calendar/20200322/109';
    const body = `
<html>
  <body>
    <table class="tbl-data-04">
      <thead><tr>
        <th class="w05 cell-bl-no">R</th>
        <th class="w10">発走時刻</th>
        <th class="w30">レース名</th>
        <th class="w05">芝ダ</th>
        <th>距離</th>
        <th>出走頭数</th>
        <th class="w30">勝馬</th>
      </tr></thead>
      <tbody><tr>
        <th class="cell-align-r">11</th>
        <td class="cell-align-c">15:35</td>
        <td><a href="/race/20200322/109/11.html">阪神大賞典</a><img class="cell-align-m" alt="GII" src="/shared/images/icon-g2-01.gif" /></td>
        <td class="cell-align-c">芝</td>
        <td class="cell-align-r">3000m</td>
        <td class="cell-align-r">10</td>
        <td>-</td>
      </tr></tbody>
    </table>
  </body>
</html>`;
    const raceList = new EntryRaceList(key, cheerio.load(body));
    const races = raceList.getRaces();
    expect(races).toEqual([
      {
        id: '2020032210911',
        courseid: '109',
        coursename: '阪神',
        racenumber: 11,
        racename: '阪神大賞典',
      },
    ]);
  });
});
