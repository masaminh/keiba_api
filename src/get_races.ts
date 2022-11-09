import { DateTime } from 'luxon';
import cheerio from 'cheerio';
import * as TE from 'fp-ts/TaskEither';
import * as F from 'fp-ts/function';
import * as A from 'fp-ts/ReadonlyArray';
import * as models from './models';
import RaceListFactory from './race_list_factory';
import Storage from './storage';

type Race = models.definitions['Race'];

const raceCalendarPrefix = 'jbis/race/calendar/';

function createGetRacesTask(key: string): TE.TaskEither<string, ReadonlyArray<Race>> {
  return F.pipe(
    key,
    (k) => Storage.getContentString(k, 'windows-31j'),
    TE.map((body) => cheerio.load(body)),
    TE.map(($) => RaceListFactory.create(key, $).getRaces()),
  );
}

function createGetRacesTaskFromKeys(
  keys: ReadonlyArray<string>,
):TE.TaskEither<string, ReadonlyArray<Race>> {
  return F.pipe(
    keys,
    A.map(createGetRacesTask),
    TE.sequenceArray,
    TE.map((a) => a.flat()),
  );
}

export default (date: DateTime): TE.TaskEither<number, ReadonlyArray<Race>> => F.pipe(
  raceCalendarPrefix + date.toFormat('yyyyMMdd'),
  Storage.getKeys, // 指定日の場ごとのファイル一覧を取得
  TE.map(createGetRacesTaskFromKeys),
  TE.flatten,
  TE.mapLeft((_r) => 500),
);
