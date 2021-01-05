import aws from 'aws-sdk';
import dotenv from 'dotenv';
import iconv from 'iconv-lite';

dotenv.config();

const region = process.env.REGION ?? '';
const bucket = process.env.BUCKET ?? '';
const s3 = new aws.S3({ apiVersion: '2006-03-01', region });

export default class {
  public static async getKeys(prefix: string): Promise<string[]> {
    const listParams = {
      Bucket: bucket,
      Prefix: prefix,
    };

    const objectsInfo = await s3.listObjectsV2(listParams).promise();
    const keys =
      objectsInfo.Contents?.map((x) => x.Key ?? '')?.filter((x) => x !== '') ??
      [];

    return keys;
  }

  public static async getContentString(
    key: string,
    encoding: string
  ): Promise<string> {
    const obj = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    const body = obj.Body as Buffer;
    return body ? iconv.decode(body, encoding) : '';
  }
}
