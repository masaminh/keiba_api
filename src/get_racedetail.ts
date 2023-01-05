import cheerio from 'cheerio';
import * as TE from 'fp-ts/TaskEither';
import * as F from 'fp-ts/function';
import * as models from './models';
import Storage from './storage';
import RaceDetailFactory from './race_detail_factory';

type RaceDetail = models.components['schemas']['RaceDetail'];

export default (id: string): TE.TaskEither<number, RaceDetail> => F.pipe(
  `jbis/race/${id.substring(0, 8)}/${id.substring(8, 11)}/${id.substring(11, 13)}.htm`,
  (key) => Storage.getContentString(key, 'windows-31j'),
  TE.mapLeft((e) => (e === 'NoSuchKey' ? 404 : 500)),
  TE.map((body) => cheerio.load(body)),
  TE.map(($) => RaceDetailFactory.create(id, $).getRaceDetail()),
);
