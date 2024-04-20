import * as Comlink from 'comlink';
import zkProgramWorker from './zkProgramWorker?worker';
import type { ZkProgramWorkerAPI } from './zkProgramWorker';

export const getClient = async (onMessage: (e: MessageEvent<any>) => void) => {
  console.log('init worker');
  const workerInstance = new zkProgramWorker();

  const zkappReady = () =>
    new Promise<void>(
      (resolve) =>
        (workerInstance.onmessage = (e) => {
          onMessage(e);
          e.data === 'ready' && resolve();
        })
    );
  await zkappReady();

  workerInstance.onmessage = (e: MessageEvent<any>) => onMessage(e);

  const proxy: Comlink.Remote<ZkProgramWorkerAPI> =
    Comlink.wrap(workerInstance);

  console.log(proxy);

  return {
    worker: workerInstance,
    // createInvoice: async (sender: PublicKey) => {
    //   await proxy.createInvoice();
    // },
  };
};

export type ClientAPI = typeof getClient;
