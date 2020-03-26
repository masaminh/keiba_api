import cheerio from 'cheerio';
import RaceListFactory from '#/race_list_factory';
import ResultRaceList from '#/result_race_list';
import EntryRaceList from '#/entry_race_list';

describe('RaceListFactory', (): void => {
  test('create ResultRaceList', (): void => {
    const key = 'jbis/race/calendar/20200105/106';
    const body = `
<html>
  <body>
    <table class="tbl-data-04">
      <thead><tr>
        <th class="cell-bl-no">R</th>
        <th class="w30">レース名</th>
        <th class="w07">距離</th>
        <th>頭数</th>
        <th colspan="2" class="w25">勝馬<ul class="cell-font-s"><li>&nbsp;生産牧場</li></ul></th>
        <th>人気</th>
        <th colspan="2" class="w25">２着馬<ul class="cell-font-s"><li>&nbsp;生産牧場</li></ul></th>
        <th>人気</th>
      </tr></thead>
      <tbody><tr>
        <th class="cell-align-r">11</th>
        <td><a href="/race/result/20200105/106/11/">中山金杯</a><img class="cell-align-m" alt="GIII" src="/shared/images/icon-g3-01.gif" /></td>
        <td class="cell-align-c">芝2000m</td>
        <td class="cell-align-r">17</td>
        <td class="cell-align-c"><span class = "position-4">7</span></td>
        <td class="cell-align-l cell-bl-no"><a href="/horse/0001186778/"><em>トリオンフ</em></a><ul class="cell-font-s"><li>&nbsp;<a href="/breeder/0000003377/ ">レイクヴィラファーム</a></li></ul></td>
        <td class="cell-align-r">2</td>
        <td class="cell-align-c"><span class = "position-4">8</span></td>
        <td class="cell-align-l cell-bl-no"><a href="/horse/0001188038/"><em>ウインイクシード</em></a><ul class="cell-font-s"><li>&nbsp;<a href="/breeder/0000000858/ ">コスモヴューファーム</a></li></ul></td>
        <td class="cell-align-r">6</td>
      </tr></tbody>
    </table>
  </body>
</html>`;
    const instance = RaceListFactory.create(key, cheerio.load(body));
    expect(instance).toBeInstanceOf(ResultRaceList);
  });

  test('create EntryRaceList', (): void => {
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
    const instance = RaceListFactory.create(key, cheerio.load(body));
    expect(instance).toBeInstanceOf(EntryRaceList);
  });
});
