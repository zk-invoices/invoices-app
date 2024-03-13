export type CommonHeader = {
  /**
   * Header version to avoid parsing incompatible headers.
   */
  version: number;
  /**
   * An identifier that is persistent even as versions of the data change. Safe to use as a file path.
   */
  persistentId: string;
  /**
   * A unique identifier for the data to be read. Safe to use as a file path.
   */
  uniqueId: string;
  /**
   * Specifies whether the data to be read is a utf8-encoded string or raw binary data. This was added
   * because node's `fs.readFileSync` returns garbage when reading string files without specifying the encoding.
   */
  dataType: 'string' | 'bytes';
};

export type StepKeyHeader<Kind> = {
  kind: Kind;
  programName: string;
  methodName: string;
  methodIndex: number;
  hash: string;
};

export type WrapKeyHeader<Kind> = {
  kind: Kind;
  programName: string;
  hash: string;
};

export type CacheHeader = (
  | StepKeyHeader<'step-pk'>
  | StepKeyHeader<'step-vk'>
  | WrapKeyHeader<'wrap-pk'>
  | WrapKeyHeader<'wrap-vk'>
) &
  CommonHeader;

export type MinaCache = {
  /**
   * Read a value from the cache.
   *
   * @param header A small header to identify what is read from the cache.
   */
  read(header: CacheHeader): Uint8Array | undefined;
  /**
   * Write a value to the cache.
   *
   * @param header A small header to identify what is written to the cache. This will be used by `read()` to retrieve the data.
   * @param value The value to write to the cache, as a byte array.
   */
  write(header: CacheHeader, value: Uint8Array): void;
  /**
   * Indicates whether the cache is writable.
   */
  canWrite: boolean;
};

async function fetchFiles(baseUrl: string) {
  const files = await fetch(
    `${baseUrl}/directory.json`
  ).then((res) => res.json());

  return Promise.all(
    files.map((file: Record<string, string>) => {
      return Promise.all([
        fetch(
          `${baseUrl}/${file.name}.header`
        ).then((res) => res.text()),
        fetch(
          `${baseUrl}/${file.name}`
        ).then((res) => res.text()),
      ]).then(([header, data]) => ({ file, header, data }));
    })
  ).then((cacheList) =>
    cacheList.reduce((acc: any, { file, header, data }) => {
      acc[file.name] = { file, header, data };

      return acc;
    }, {})
  );
}

const FileSystem = (files: any, onAccess?: any): MinaCache => ({
  read({ persistentId, uniqueId, dataType }: any) {
    if (!files[persistentId]) {
      console.log('read');
      console.log({ persistentId, uniqueId, dataType });

      return undefined;
    }

    const currentId = files[persistentId].header;

    if (currentId !== uniqueId) {
      console.log('current id did not match persistent id');

      return undefined;
    }

    if (dataType === 'string') {
      onAccess({ type: 'hit', persistentId, uniqueId, dataType });

      return new TextEncoder().encode(files[persistentId].data);
    }
    // Due to the large size of prover keys, they will be compiled on the users machine.
    // This allows for a non blocking UX implementation.
    // else {
    //   let buffer = readFileSync(resolve(cacheDirectory, persistentId));
    //   return new Uint8Array(buffer.buffer);
    // }
    onAccess({ type: 'miss', persistentId, uniqueId, dataType });

    return undefined;
  },
  write({ persistentId, uniqueId, dataType }: any) {
    console.log('write');
    console.log({ persistentId, uniqueId, dataType });
  },
  canWrite: true,
});

export default function AsyncMinaCache(cacheBaseUrl: string, onHitOrMiss: ({ type, persistentId }: any) => void) {
  let files: string[] = [];

  return {
    fetch: async () => {
      files = await fetchFiles(cacheBaseUrl)
    },
    cache: () => FileSystem(files, onHitOrMiss)
  }
}
