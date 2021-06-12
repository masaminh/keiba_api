// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const awsMock = require('aws-sdk-mock');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

awsMock.setSDK(path.resolve('node_modules/aws-sdk'));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
awsMock.mock('S3', 'listObjectsV2', (params: any, callback: any) => {
  if (params.Prefix === 'prefix1') {
    callback(null, {
      Contents: [{ Key: 'prefix/key1' }, { Key: 'prefix/key2' }],
    });
  } else if (params.Prefix === 'prefix2') {
    callback(null, { Contents: null });
  } else {
    callback(null, {
      Contents: [{ Key: null }],
    });
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
awsMock.mock('S3', 'getObject', (params: any, callback: any) => {
  callback(null, {
    Body: Buffer.from('abc', 'utf-8'),
  });
});

process.env.REGION = 'ap-northeast-1';
process.env.BUCKET = 'bucket';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const storage = require('./storage').default;

describe('Storage', (): void => {
  test.each`
    prefix       | expected                          | message
    ${'prefix1'} | ${['prefix/key1', 'prefix/key2']} | ${'通常時'}
    ${'prefix2'} | ${[]}                             | ${'listObjectsV2がContents: nullを返したときは空リストを返す'}
    ${'prefix3'} | ${[]}                             | ${'listObjectsV2がKey: nullを返したときは空リストを返す'}
  `('$message', async ({ prefix, expected }) => {
    const keys = await storage.getKeys(prefix);
    expect(keys).toEqual(expected);
  });
});

describe('Storage', (): void => {
  test('getContentString', async () => {
    const content = await storage.getContentString('prefix', 'utf-8');
    expect(content).toEqual('abc');
  });
});
