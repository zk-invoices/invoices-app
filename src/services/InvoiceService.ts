import {
  Timestamp,
  addDoc,
  collection,
  getFirestore,
} from 'firebase/firestore';
import { Field, Poseidon, PublicKey } from 'o1js';

export type RawInvoice = {
  id: string;
  seller: string;
  buyer: string;
  amount: number;
  provider: string;
  createdAt: Timestamp;
  dueDate: Timestamp;
  minaId: string;
  metadata: Record<string, any>
};

export function createInvoice(invoice: RawInvoice) {
  const db = getFirestore();
  const col = collection(db, 'invoices');

  const createdAt = new Date();

  invoice.minaId = Poseidon.hash([Field.random(), ...PublicKey.fromBase58(invoice.seller).toFields()]).toString();

  return addDoc(col, Object.assign({ createdAt }, invoice));
}
