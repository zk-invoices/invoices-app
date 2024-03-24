import { PrivateKey } from 'o1js';
import { useState } from 'react';

export function useRandomInvoice(from: string) {
  const [invoice, setInvoice] = useState({
    seller: from,
    buyer: PrivateKey.random().toPublicKey().toBase58().toString(),
    amount: 0,
  });

  function regenerate() {
    setInvoice({
      seller: from,
      buyer: PrivateKey.random().toPublicKey().toBase58().toString(),
      amount: 0,
    });
  }

  return { invoice, regenerate };
}
