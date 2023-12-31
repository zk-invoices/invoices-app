// import * as Comlink from "comlink";
import {
  Mina,
  PublicKey,
  // MerkleTree,
  UInt32,
  fetchAccount,
} from "o1js";
import {
  // Invoice,
  // Invoices,
  InvoicesProvider,
  // InvoicesWitness,
} from "../../contracts/build/src/";
import type { MinaCache } from "./cache";

const zkAppAddress = "B62qmUQ7bpqVr4P3gj7RbmNmEdnA892NqwSJcmxgN6xMDVamiXQgAy8";
// const minaUrl = "https://proxy.berkeley.minaexplorer.com/graphql";
// const archiveUrl = "https://archive.berkeley.minaexplorer.com";

const minaUrl = 'https://api.minascan.io/node/berkeley/v1/graphql';
const archiveUrl = 'https://api.minascan.io/archive/berkeley/v1/graphql/';
const files = [
  { name: "lagrange-basis-fp-2048", type: "string" },
  { name: "lagrange-basis-fp-4096", type: "string" },
  { name: "srs-fp-65536", type: "string" },
  { name: "srs-fq-32768", type: "string" },
  { name: "step-pk-invoicesprovider-commit", type: "string" },
  { name: "step-pk-invoicesprovider-createinvoice", type: "string" },
  { name: "step-pk-invoicesprovider-increaselimit", type: "string" },
  { name: "step-pk-invoicesprovider-mint", type: "string" },
  { name: "step-pk-invoicesprovider-settleinvoice", type: "string" },
  { name: "step-pk-invoicesprovider-upgrade", type: "string" },
  { name: "wrap-pk-invoicesprovider", type: "string" },
];

function fetchFiles() {
  return Promise.all(
    files.map((file) => {
      return Promise.all([
        fetch(`http://localhost:3000/cache/provider/${file.name}.header`).then(
          (res) => res.text()
        ),
        fetch(`http://localhost:3000/cache/provider/${file.name}`).then((res) =>
          res.text()
        ),
      ]).then(([header, data]) => ({ file, header, data }));
    })
  ).then((cacheList) =>
    cacheList.reduce((acc: any, { file, header, data }) => {
      acc[file.name] = { file, header, data };

      return acc;
    }, {})
  );
}

const FileSystem = (files: any, onAccess: any): MinaCache => ({
  read({ persistentId, uniqueId, dataType }: any) {
    // read current uniqueId, return data if it matches
    if (!files[persistentId]) {
      console.log("read");
      console.log({ persistentId, uniqueId, dataType });

      return undefined;
    }

    const currentId = files[persistentId].header;

    if (currentId !== uniqueId) {
      console.log("current id did not match persistent id");

      return undefined;
    }

    if (dataType === "string") {
      onAccess({ type: "hit", persistentId, uniqueId, dataType });

      return new TextEncoder().encode(files[persistentId].data);
    }
    // Due to the large size of prover keys, they will be compiled on the users machine.
    // This allows for a non blocking UX implementation.
    // else {
    //   let buffer = readFileSync(resolve(cacheDirectory, persistentId));
    //   return new Uint8Array(buffer.buffer);
    // }
    onAccess({ type: "miss", persistentId, uniqueId, dataType });

    return undefined;
  },
  write({ persistentId, uniqueId, dataType }: any) {
    console.log("write");
    console.log({ persistentId, uniqueId, dataType });
  },
  canWrite: true,
});

const network = Mina.Network({
  mina: minaUrl,
  archive: archiveUrl,
});
Mina.setActiveInstance(network);

await fetchAccount({ publicKey: zkAppAddress }, minaUrl);

const zkApp = new InvoicesProvider(PublicKey.fromBase58(zkAppAddress));

zkApp;

addEventListener("message", (event: MessageEvent) => {
  console.log("worker event message", event.data);
  const { action, data } = event.data;

  if (action === "getCommitment") {
    // const commitment = zkApp.commitment.get().toString();
    // postMessage({
    //   type: 'response',
    //   action: 'getCommitment',
    //   data: { commitment }
    // });
  }

  if (action === "createInvoice") {
    const from = PublicKey.fromBase58(data.from);
    const to = PublicKey.fromBase58(data.to);
    const amount = UInt32.from(data.amount);

    createInvoice(from, to, amount).then((txn) => {
      postMessage({
        type: "response",
        action: "transaction",
        data: { txn },
      });
    });
  }

  if (action === "commit") {
    commit().then((txn) => {
      postMessage({
        type: "response",
        action: "transaction",
        data: { txn },
      });
    });
  }
});

postStatusUpdate({ message: "Loading cached zkApp files" });
const cacheFiles = await fetchFiles();
const cache = FileSystem(
  cacheFiles,
  ({ type, persistentId, uniqueId, dataType }: any) => {
    console.log(uniqueId, dataType);
    if (type === "hit") {
      postStatusUpdate({
        message: `Found ${persistentId} in pre-built binaries`,
      });
    }

    if (type === "miss") {
      postStatusUpdate({ message: `Compiling ${persistentId}` });
    }
  }
);

postStatusUpdate({ message: "Initiated zkApp compilation process" });
await InvoicesProvider.compile({ cache });
postMessage({
  type: "zkapp",
  action: "compiled",
});
postStatusUpdate({ message: "" });

// const tree = new MerkleTree(32);

async function commit() {
  // console.log("sending transaction");
  // await fetchAccount(
  //   { publicKey: zkAppAddress },
  //   minaUrl
  // );
  // postStatusUpdate({ message: 'Crafting transaction' });
  // const sender = PublicKey.fromBase58('B62qqgbzVWR7MVQyL8M3chhKXScVGD4HZxrcZoViSqroDCzC4Qd68Yh');
  // const fee = Number(0.1) * 1e9;
  // const tx = await Mina.transaction({ sender: sender, fee }, () => {
  //   zkApp.commit();
  // });
  // postStatusUpdate({ message: 'Creating transaction proof' });
  // console.log("creating proof");
  // await tx.prove();
  // console.log("created proof");
  // postStatusUpdate({ message: 'Sending transaction' });
  // return tx.toJSON();
}

async function createInvoice(from: PublicKey, to: PublicKey, amount: UInt32) {
  console.log({ from, to, amount });
  // console.log("sending transaction");
  // console.log("tree root", tree.getRoot().toString());
  // const account = PublicKey.fromBase58(
  //   "B62qqgbzVWR7MVQyL8M3chhKXScVGD4HZxrcZoViSqroDCzC4Qd68Yh"
  // );
  // await fetchAccount(
  //   { publicKey: zkAppAddress },
  //   minaUrl
  // );
  // const invoice = new Invoice({
  //   from,
  //   to,
  //   amount,
  //   settled: Bool(false),
  //   metadataHash: Field(0),
  // });
  // postStatusUpdate({ message: 'Crafting transaction' });
  // const sender = PublicKey.fromBase58('B62qqgbzVWR7MVQyL8M3chhKXScVGD4HZxrcZoViSqroDCzC4Qd68Yh');
  // const fee = Number(0.1) * 1e9;
  // const tx = await Mina.transaction({ sender: sender, fee }, () => {
  //   zkApp.createInvoice(invoice, new InvoicesWitness(tree.getWitness(0n)));
  // });
  // postStatusUpdate({ message: 'Creating transaction proof' });
  // console.log("creating proof");
  // await tx.prove();
  // console.log("created proof");
  // postStatusUpdate({ message: 'Sending transaction' });
  // return tx.toJSON();
}

function postStatusUpdate({ message }: { message: string }) {
  postMessage({ type: "update", data: message });
}
