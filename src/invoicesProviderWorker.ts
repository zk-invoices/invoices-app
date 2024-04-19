import * as Comlink from 'comlink';
import { PublicKey, UInt32 } from 'o1js';
import AsyncMinaCache from './cache';

const minaUrl = import.meta.env.VITE_ZK_MINA_GRAPH;
const archiveUrl = import.meta.env.VITE_ZK_MINA_ARCHIVE;

function postStatusUpdate({ message }: { message: string }) {
  postMessage({ type: 'update', data: message });
}

const getAPI = async () => {
  const { AccountUpdate, Bool, Field, MerkleTree, Mina, fetchAccount } =
    await import('o1js');

  const zkAppAddress = PublicKey.fromBase58(
    import.meta.env.VITE_ZK_APP_ADDRESS
  );

  const { Invoices, InvoicesProvider } = await import('invoices/build/src');

  const { Invoice, InvoicesWitness } = await import(
    'invoices/src/InvoicesModels'
  );

  const network = Mina.Network({
    mina: minaUrl,
    archive: archiveUrl,
  });
  Mina.setActiveInstance(network);

  await fetchAccount({ publicKey: zkAppAddress });

  const zkApp = new InvoicesProvider(zkAppAddress);

  const compileInvoices = (function invoicesCompiler() {
    let compiled: Promise<any> | undefined;

    return async () => {
      if (compiled) {
        return compiled;
      }

      const invoicesCache = AsyncMinaCache(
        `${import.meta.env.VITE_ZK_APPS_CACHE_BASE_URL}/${import.meta.env.VITE_ZK_APPS_CACHE_INVOICES}`,
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

      console.log('compile zkapp');
      await invoicesCache.fetch();
      compiled = Invoices.compile({
        cache: invoicesCache.cache(),
      });

      compiled.then(() => {
        console.log('compile zkapp: done');
      });

      return compiled;
    };
  })();

  postStatusUpdate({ message: 'Loading cached zkApp files' });
  const providerCache = AsyncMinaCache(
    `${import.meta.env.VITE_ZK_APPS_CACHE_BASE_URL}/${import.meta.env.VITE_ZK_APPS_CACHE_PROVIDER}`,
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

  await providerCache.fetch();
  await InvoicesProvider.compile({ cache: providerCache.cache() });

  return {
    mint: async function mint(senderAddress: PublicKey) {
      console.log('sending transaction', zkAppAddress);

      postStatusUpdate({
        message: `Now compiling invoices app`,
      });

      const invoicesVkGenerated = await compileInvoices();

      const zkAppData = await fetchAccount(
        {
          publicKey: zkAppAddress,
        },
        minaUrl
      );

      console.log(
        'app state',
        zkAppData.account?.zkapp?.appState[0].toString()
      );

      await fetchAccount({
        publicKey: senderAddress,
        tokenId: zkApp.token.id,
      });

      await fetchAccount({
        publicKey: senderAddress,
      });

      postStatusUpdate({ message: 'Crafting transaction' });
      const fee = Number(0.1) * 1e9;
      const tree = new MerkleTree(32);

      await fetchAccount({ publicKey: zkAppAddress });
      const tx = await Mina.transaction({ sender: senderAddress, fee }, () => {
        AccountUpdate.fundNewAccount(senderAddress);
        zkApp.mint(
          senderAddress,
          invoicesVkGenerated.verificationKey,
          tree.getRoot()
        );
      });

      postStatusUpdate({ message: 'Creating transaction proof' });
      console.log('creating proof');
      await tx.prove();
      console.log('created proof');
      postStatusUpdate({ message: 'Sending transaction' });

      return {
        txn: tx.toJSON(),
        meta: {
          task: 'mint-account',
          createdAt: new Date(),
          args: {
            sender: senderAddress.toBase58(),
          },
        },
      };
    },

    createInvoice: async function createInvoice(
      id: string,
      dueDate: UInt32,
      from: PublicKey,
      to: PublicKey,
      amount: UInt32
    ) {
      await compileInvoices();
      const tree = new MerkleTree(32);

      const invoice = new Invoice({
        id: Field.from(id),
        dueDate: dueDate,
        seller: from,
        buyer: to,
        amount,
        metadataHash: Field(0),
        settled: Bool(false),
        createdAt: dueDate,
        updatedAt: dueDate,
        itemsRoot: Field(0),
      });

      postStatusUpdate({ message: 'Crafting transaction' });
      const fee = Number(0.1) * 1e9;

      const userInvoicesApp = new Invoices(from, zkApp.token.id);

      await fetchAccount(
        {
          publicKey: from,
        },
        minaUrl
      );

      await fetchAccount(
        {
          publicKey: from,
          tokenId: zkApp.token.id,
        },
        minaUrl
      );

      const tx = await Mina.transaction({ sender: from, fee }, () => {
        userInvoicesApp.createInvoice(
          invoice,
          new InvoicesWitness(tree.getWitness(0n))
        );

        zkApp.approveAccountUpdate(userInvoicesApp.self);
      });

      postStatusUpdate({ message: 'Creating transaction proof' });
      console.log('creating proof');
      await tx.prove();
      console.log('created proof');
      postStatusUpdate({ message: 'Sending transaction' });

      return {
        txn: tx.toJSON(),
        meta: {
          task: 'create-new-invoice',
          createdAt: new Date(),
          args: {
            id: id.toString(),
            dueDate: new Date(Number(dueDate.toBigint()) * 1000),
            from: from.toBase58(),
            to: to.toBase58(),
            amount: amount.toString(),
          },
        },
      };
    },

    commit: async function commit(from: PublicKey) {
      console.log('commit: compile invoices zkapp');
      await compileInvoices();
      console.log('commit: compiled zkapp');

      postStatusUpdate({ message: 'Crafting transaction' });
      const fee = Number(0.1) * 1e9;

      const userInvoicesApp = new Invoices(from, zkApp.token.id);
      await fetchAccount({ publicKey: zkAppAddress }, minaUrl);
      await fetchAccount({ publicKey: from }, minaUrl);
      await fetchAccount(
        {
          publicKey: from,
          tokenId: zkApp.token.id,
        },
        minaUrl
      );

      const tx = await Mina.transaction({ sender: from, fee }, () => {
        userInvoicesApp.commit();

        zkApp.approveAccountUpdate(userInvoicesApp.self);
      });

      postStatusUpdate({ message: 'Creating transaction proof' });
      console.log('creating proof');
      await tx.prove();
      console.log('created proof');
      postStatusUpdate({ message: 'Sending transaction' });

      return {
        txn: tx.toJSON(),
        meta: {
          task: 'commit-actions',
          createdAt: new Date(),
          args: {
            sender: from.toBase58(),
          },
        },
      };
    },
  };
};

const exposed = await getAPI();
Comlink.expose(exposed);
postMessage('ready');

export type ZkappWorkerAPI = typeof exposed;
