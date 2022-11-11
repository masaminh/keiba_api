// eslint-disable-next-line import/no-extraneous-dependencies
import awsMock from 'aws-sdk-mock';
import path from 'path';
import { Logger } from '@aws-lambda-powertools/logger';
import * as E from 'fp-ts/Either';

jest.mock('@aws-lambda-powertools/logger');
const LoggerMock = Logger as unknown as jest.Mock;
LoggerMock.mockImplementation(() => ({ info: jest.fn(), warn: jest.fn() }));

awsMock.setSDK(path.resolve('node_modules/aws-sdk'));

function newAwsError(code: string): Error {
  const e = new Error();
  (e as Error & { code: string}).code = code;
  return e;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
awsMock.mock('S3', 'listObjectsV2', (params: any, callback: any) => {
  if (params.Prefix === 'prefix1') {
    callback(null, {
      Contents: [{ Key: 'prefix/key1' }, { Key: 'prefix/key2' }],
    });
  } else if (params.Prefix === 'prefix2') {
    callback(null, { Contents: null });
  } else if (params.Prefix === 'prefix3') {
    callback(null, {
      Contents: [{ Key: null }],
    });
  } else if (params.Prefix === 'prefix4') {
    callback(newAwsError('ERROR'));
  } else if (params.Prefix === 'prefix5') {
    callback(new Error('ERROR'));
  } else {
    callback('ERROR');
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
awsMock.mock('S3', 'getObject', (params: any, callback: any) => {
  if (params.Key === 'key1') {
    callback(null, {
      Body: Buffer.from('abc', 'utf-8'),
    });
  } else if (params.Key === 'key2') {
    callback(newAwsError('NoSuchKey'));
  } else if (params.Key === 'key3') {
    callback(newAwsError('ERROR'));
  } else if (params.Key === 'key4') {
    callback(new Error('ERROR'));
  } else {
    callback('ERROR');
  }
});

process.env.REGION = 'ap-northeast-1';
process.env.BUCKET = 'bucket';

// ↓importにするとaws-sdkが正しくモック化されないため、ここでrequireしている
// eslint-disable-next-line @typescript-eslint/no-var-requires
const storage = require('./storage').default;

describe('Storage', (): void => {
  test.each`
    prefix       | expected                          | message
    ${'prefix1'} | ${['prefix/key1', 'prefix/key2']} | ${'通常時'}
    ${'prefix2'} | ${[]}                             | ${'listObjectsV2がContents: nullを返したときは空リストを返す'}
    ${'prefix3'} | ${[]}                             | ${'listObjectsV2がKey: nullを返したときは空リストを返す'}
  `('getKeys: $message', async ({ prefix, expected }) => {
    const keys = await storage.getKeys(prefix)();
    expect(E.isRight(keys)).toBe(true);
    expect(keys.right).toEqual(expected);
  });

  test.each`
    prefix       | message
    ${'prefix4'} | ${'AWSError'}
    ${'prefix5'} | ${'Error'}
    ${'prefix6'} | ${'string'}
  `('getKeys: $message', async ({ prefix }) => {
    const keys = await storage.getKeys(prefix)();
    expect(E.isLeft(keys)).toBe(true);
    expect(keys.left).toBe('ERROR');
  });

  test('getContentString', async () => {
    const content = await storage.getContentString('key1', 'utf-8')();
    expect(E.isRight(content)).toBe(true);
    expect(content.right).toEqual('abc');
  });

  test.each`
    key       | message
    ${'key2'} | ${'NoSuchKey'}
    ${'key3'} | ${'ERROR'}
    ${'key4'} | ${'ERROR'}
    ${'key5'} | ${'ERROR'}
  `('getContentString: $message', async ({ key, message }) => {
    const content = await storage.getContentString(key, 'utf-8')();
    expect(E.isLeft(content)).toBe(true);
    expect(content.left).toBe(message);
  });
});
