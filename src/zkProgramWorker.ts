import * as Comlink from 'comlink';
import { PublicKey, UInt32 } from 'o1js';
import AsyncMinaCache from './cache';

function postStatusUpdate({ message }: { message: string }) {
  postMessage({ type: 'update', data: message });
}

const getAPI = async () => {
  const { InvoicesProgram } = await import('invoices/build/src');

  postStatusUpdate({ message: 'Loading cached zkApp files' });
  const programCache = AsyncMinaCache(
    `${import.meta.env.VITE_ZK_APPS_CACHE_BASE_URL}/${import.meta.env.VITE_PROGRAM_CACHE}`,
    ({ type, persistentId }: any) => {
      if (type === 'hit') {
        postStatusUpdate({
          message: `Found ${persistentId} in pre-built binaries`,
        });
      }

      if (type === 'miss') {
        postStatusUpdate({ message: `Compiling ${persistentId}` });
      }
    }
  );

  postStatusUpdate({ message: 'Initiated zkApp compilation process' });

  await programCache.fetch();
  await InvoicesProgram.compile({ cache: programCache.cache() });

  return {
    createInvoice: async function createInvoice(
      id: string,
      dueDate: UInt32,
      from: PublicKey,
      to: PublicKey,
      amount: UInt32
    ) {
      console.log(id, dueDate, from, to, amount);
    },
  };
};

const exposed = await getAPI();
Comlink.expose(exposed);
postMessage('ready');

export type ZkProgramWorkerAPI = typeof exposed;
