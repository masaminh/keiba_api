import {
  GetObjectCommand,
  GetObjectCommandOutput,
  ListObjectsCommand,
  ListObjectsCommandOutput,
  S3Client,
  S3ServiceException,
  NoSuchKey,
} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import * as TE from 'fp-ts/TaskEither';
import * as F from 'fp-ts/function';
import Log from './log';

dotenv.config();

const logger = Log.getLogger();

let bucket: string = '';
let s3: S3Client | undefined;

export default class Storage {
  public static initialize(region_: string, bucket_: string) {
    bucket = bucket_;
    s3 = new S3Client({ region: region_ });
  }

  public static uninitialize() {
    bucket = '';
    s3 = undefined;
  }

  public static getKeys(prefix: string): TE.TaskEither<string, ReadonlyArray<string>> {
    return F.pipe(
      { Bucket: bucket, Prefix: prefix },
      Storage.listS3Object,
      TE.map(
        (o) => o.Contents?.map((x) => x.Key ?? '')?.filter((x) => x !== '') ?? [],
      ),
    );
  }

  public static getContentString(
    key: string,
    encoding: string,
  ): TE.TaskEither<string, string> {
    return F.pipe(
      { Bucket: bucket, Key: key },
      Storage.getS3Object,
      TE.map(Storage.getBodyString(encoding)),
      TE.flatten,
    );
  }

  private static listS3Object(
    params: {Bucket: string, Prefix: string},
  ): TE.TaskEither<string, ListObjectsCommandOutput> {
    return TE.tryCatch(
      () => {
        logger.info('call ListObjectsCommand', { params });
        if (s3 == null) {
          throw new Error('Storage: not initialized');
        }
        return s3.send(new ListObjectsCommand(params));
      },
      (r) => {
        logger.warn('ListObjectsCommand raise Error', { error: r });

        if (r instanceof S3ServiceException) {
          const { name } = r;
          return name;
        }

        if (r instanceof Error) {
          return r.message;
        }

        return `${r}`;
      },
    );
  }

  private static getS3Object(
    params: {Bucket: string, Key: string},
  ): TE.TaskEither<string, GetObjectCommandOutput> {
    return TE.tryCatch(
      () => {
        logger.info('call GetObjectCommand', { params });
        if (s3 == null) {
          throw new Error('Storage: not initialized');
        }
        return s3.send(new GetObjectCommand(params));
      },
      (r) => {
        if (r instanceof S3ServiceException) {
          const { name } = r;
          logger[r instanceof NoSuchKey ? 'info' : 'warn']('GetObjectCommand raise Error', { error: r });
          return name;
        }

        logger.warn('GetObjectCommand raise Error', { error: r });

        if (r instanceof Error) {
          return r.message;
        }

        return `${r}`;
      },
    );
  }

  private static getBodyString(
    encoding: string,
  ): (arg0: GetObjectCommandOutput) => TE.TaskEither<string, string> {
    return (output: GetObjectCommandOutput) => TE.tryCatch(
      () => {
        if (output.Body == null) {
          logger.warn('GetObjectCommandOutput.Body is null');
          throw new Error('GetObjectCommandOutput.Body is null');
        }

        return output.Body.transformToString(encoding);
      },
      (r) => (r instanceof Error ? r.message : `${r}`),
    );
  }
}
