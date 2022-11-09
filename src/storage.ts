import aws, { S3 } from 'aws-sdk';
import dotenv from 'dotenv';
import iconv from 'iconv-lite';
import * as TE from 'fp-ts/TaskEither';
import * as F from 'fp-ts/function';
import Log from './log';

dotenv.config();

const logger = Log.getLogger();

const region = process.env.REGION ?? '';
const bucket = process.env.BUCKET ?? '';
const s3 = new aws.S3({ apiVersion: '2006-03-01', region });

type WouldBe<T> = { [P in keyof T]?: unknown }

function isObject<T extends object>(value: unknown): value is WouldBe<T> {
  return typeof value === 'object'
        && value !== null;
}

function isAWSError(arg: unknown): arg is aws.AWSError {
  return isObject<aws.AWSError>(arg)
    && typeof arg.code === 'string'
    && arg instanceof Error;
}
export default class Storage {
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
      TE.map((obj) => iconv.decode(obj.Body as Buffer, encoding)),
    );
  }

  private static listS3Object(
    params: {Bucket: string, Prefix: string},
  ): TE.TaskEither<string, S3.ListObjectsV2Output> {
    return TE.tryCatch(
      () => {
        logger.info('call s3.listObjectV2', { params });
        return s3.listObjectsV2(params).promise();
      },
      (r) => {
        logger.warn('s3.listObjectV2 raise Error', { error: r });

        if (isAWSError(r)) {
          return r.code;
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
  ): TE.TaskEither<string, S3.GetObjectOutput> {
    return TE.tryCatch(
      () => {
        logger.info('call s3.getObject', { params });
        return s3.getObject(params).promise();
      },
      (r) => {
        if (isAWSError(r)) {
          const { code } = r;
          logger[code === 'NoSuchKey' ? 'info' : 'warn']('s3.getObject raise Error', { error: r });
          return code;
        }

        logger.warn('s3.getObject raise Error', { error: r });

        if (r instanceof Error) {
          return r.message;
        }

        return `${r}`;
      },
    );
  }
}
