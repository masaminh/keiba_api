import aws from 'aws-sdk';
import dotenv from 'dotenv';
import iconv from 'iconv-lite';
import Log from './log';

dotenv.config();

const logger = Log.getLogger();

const region = process.env.REGION ?? '';
const bucket = process.env.BUCKET ?? '';
const s3 = new aws.S3({ apiVersion: '2006-03-01', region });

export default class {
  public static async getKeys(prefix: string): Promise<string[]> {
    const listParams = {
      Bucket: bucket,
      Prefix: prefix,
    };

    logger.info('call listObjectV2', { params: listParams });
    const objectsInfo = await s3.listObjectsV2(listParams).promise();
    return (
      objectsInfo.Contents?.map((x) => x.Key ?? '')?.filter((x) => x !== '')
      ?? []
    );
  }

  public static async getContentString(
    key: string,
    encoding: string,
  ): Promise<string> {
    const params = { Bucket: bucket, Key: key };
    logger.info('call getObject', { params });
    const obj = await s3.getObject(params).promise();
    return iconv.decode(obj.Body as Buffer, encoding);
  }
}
