/* eslint-disable import/no-extraneous-dependencies */
import { mockClient } from 'aws-sdk-client-mock';
import { sdkStreamMixin } from '@aws-sdk/util-stream-node';
/* eslint-enable import/no-extraneous-dependencies */
import {
  S3Client, GetObjectCommand, ListObjectsCommand, S3ServiceException, NoSuchKey,
} from '@aws-sdk/client-s3';
import { Logger } from '@aws-lambda-powertools/logger';
import * as E from 'fp-ts/Either';
import { Readable } from 'stream';
import Storage from './storage';

jest.mock('@aws-lambda-powertools/logger');
const LoggerMock = Logger as unknown as jest.Mock;
LoggerMock.mockImplementation(() => ({ info: jest.fn(), warn: jest.fn() }));

function getSdkStream(text: string) {
  const stream = new Readable();
  stream.push(text);
  stream.push(null);

  return sdkStreamMixin(stream);
}

describe('Storage', (): void => {
  beforeAll(() => {
    const s3Mock = mockClient(S3Client);

    s3Mock
      .on(ListObjectsCommand, { Prefix: 'prefix1' })
      .resolves({
        Contents: [{ Key: 'prefix/key1' }, { Key: 'prefix/key2' }],
      })
      .on(ListObjectsCommand, { Prefix: 'prefix2' })
      .resolves({
        Contents: undefined,
      })
      .on(ListObjectsCommand, { Prefix: 'prefix3' })
      .resolves({
        Contents: [{ Key: undefined }],
      })
      .on(ListObjectsCommand, { Prefix: 'prefix4' })
      .rejects(new S3ServiceException({
        name: 'ERROR', $fault: 'client', $metadata: { requestId: 'id' }, message: 'ERROR',
      }))
      .on(ListObjectsCommand, { Prefix: 'prefix5' })
      .rejects('ERROR')
      .on(GetObjectCommand, { Key: 'key1' })
      .resolves({ Body: getSdkStream('abc') })
      .on(GetObjectCommand, { Key: 'key2' })
      .rejects(new NoSuchKey({ $metadata: { requestId: 'id' }, message: 'ERROR' }))
      .on(GetObjectCommand, { Key: 'key3' })
      .rejects(new S3ServiceException({
        name: 'ERROR', $fault: 'client', $metadata: { requestId: 'id' }, message: 'ERROR',
      }))
      .on(GetObjectCommand, { Key: 'key4' })
      .rejects('ERROR')
      .on(GetObjectCommand, { Key: 'key5' })
      .resolves({ Body: undefined });
  });

  beforeEach(() => {
    Storage.initialize('ap-northeast-1', 'bucket');
  });

  afterEach(() => {
    Storage.uninitialize();
  });

  test.each`
    prefix       | expected                          | message
    ${'prefix1'} | ${['prefix/key1', 'prefix/key2']} | ${'通常時'}
    ${'prefix2'} | ${[]}                             | ${'listObjectsV2がContents: nullを返したときは空リストを返す'}
    ${'prefix3'} | ${[]}                             | ${'listObjectsV2がKey: nullを返したときは空リストを返す'}
  `('getKeys: $message', async ({ prefix, expected }) => {
    const keys = await Storage.getKeys(prefix)();
    expect(keys).toEqual(E.right(expected));
  });

  test.each`
    prefix       | message
    ${'prefix4'} | ${'AWSError'}
    ${'prefix5'} | ${'Error'}
  `('getKeys: $message', async ({ prefix }) => {
    const keys = await Storage.getKeys(prefix)();
    expect(keys).toEqual(E.left('ERROR'));
  });

  test('getContentString', async () => {
    const content = await Storage.getContentString('key1', 'utf-8')();
    expect(content).toEqual(E.right('abc'));
  });

  test.each`
    key       | message
    ${'key2'} | ${'NoSuchKey'}
    ${'key3'} | ${'ERROR'}
    ${'key4'} | ${'ERROR'}
    ${'key5'} | ${'GetObjectCommandOutput.Body is null'}
  `('getContentString: $message', async ({ key, message }) => {
    const content = await Storage.getContentString(key, 'utf-8')();
    expect(content).toEqual(E.left(message));
  });
});

describe('Storage: Throw no error', () => {
  beforeAll(() => {
    const s3Mock = mockClient(S3Client);

    s3Mock
      .callsFake(() => {
        // eslint-disable-next-line no-throw-literal
        throw 'ERROR';
      });
  });

  beforeEach(() => {
    Storage.initialize('ap-northeast-1', 'bucket');
  });

  afterEach(() => {
    Storage.uninitialize();
  });

  it('getKeys', async () => {
    const keys = await Storage.getKeys('')();
    expect(keys).toEqual(E.left('ERROR'));
  });

  it('getContentString', async () => {
    const content = await Storage.getContentString('', 'utf-8')();
    expect(content).toEqual(E.left('ERROR'));
  });
});

describe('Storage: Throw no error (transformToString)', () => {
  beforeAll(() => {
    const s3Mock = mockClient(S3Client);

    s3Mock
      .on(GetObjectCommand)
      .resolves({
        Body: {
          transformToString: () => {
            // eslint-disable-next-line no-throw-literal
            throw 'ERROR';
          },
        } as unknown as ReturnType<typeof getSdkStream>,
      });
  });

  beforeEach(() => {
    Storage.initialize('ap-northeast-1', 'bucket');
  });

  afterEach(() => {
    Storage.uninitialize();
  });

  it('getContentString', async () => {
    const content = await Storage.getContentString('', 'utf-8')();
    expect(content).toEqual(E.left('ERROR'));
  });
});

describe('Storage: Not initialized', () => {
  beforeAll(() => {
    const s3Mock = mockClient(S3Client);

    s3Mock
      .on(ListObjectsCommand, { Prefix: 'prefix1' })
      .resolves({
        Contents: [{ Key: 'prefix/key1' }, { Key: 'prefix/key2' }],
      })
      .on(GetObjectCommand, { Key: 'key1' })
      .resolves({ Body: getSdkStream('abc') });
  });

  it('getKeys', async () => {
    const keys = await Storage.getKeys('prefix1')();
    expect(E.isLeft(keys)).toBe(true);
  });

  it('getKeys', async () => {
    const content = await Storage.getContentString('key1', 'utf-8')();
    expect(E.isLeft(content)).toBe(true);
  });
});
