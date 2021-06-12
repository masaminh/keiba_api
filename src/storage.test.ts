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
  test('getKeys', async () => {
    const keys = await storage.getKeys('prefix1');
    expect(keys).toEqual(['prefix/key1', 'prefix/key2']);
  });
});

describe('Storage', (): void => {
  test('getKeys_empty', async () => {
    const keys = await storage.getKeys('prefix2');
    expect(keys).toEqual([]);
  });
});

describe('Storage', (): void => {
  test('getKeys_key_null', async () => {
    const keys = await storage.getKeys('prefix3');
    expect(keys).toEqual([]);
  });
});

describe('Storage', (): void => {
  test('getContentString', async () => {
    const content = await storage.getContentString('prefix', 'utf-8');
    expect(content).toEqual('abc');
  });
});
