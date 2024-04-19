import * as Comlink from 'comlink';
import ZkappWorker from './invoicesProviderWorker?worker';
import type { ZkappWorkerAPI } from './invoicesProviderWorker';
import { PublicKey } from 'o1js';

export const getClient = async (onMessage: (e: MessageEvent<any>) => void) => {
  console.log('init worker');
  const zkappWorker = new ZkappWorker();
  const zkappReady = () =>
    new Promise<void>(
      (resolve) =>
        (zkappWorker.onmessage = (e) => {
          onMessage(e);
          e.data === 'ready' && resolve();
        })
    );
  await zkappReady();

  zkappWorker.onmessage = (e: MessageEvent<any>) => onMessage(e);

  const proxy: Comlink.Remote<ZkappWorkerAPI> = Comlink.wrap(zkappWorker);
  return {
    worker: zkappWorker,
    mint: async (sender: PublicKey) => {
      await proxy.mint(sender);
    },
  };
};

export type ClientAPI = typeof getClient;
