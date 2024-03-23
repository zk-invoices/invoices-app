import { PrivateKey } from 'o1js';
import { useState } from 'react';

export function useRandomInvoice(from: string) {
  const [invoice, setInvoice] = useState({
    seller: from,
    buyer: PrivateKey.random().toPublicKey().toBase58().toString(),
    amount: Math.floor(Math.random() * 1000),
  });

  function regenerate() {
    setInvoice({
      seller: from,
      buyer: PrivateKey.random().toPublicKey().toBase58().toString(),
      amount: Math.floor(Math.random() * 1000),
    });
  }

  return { invoice, regenerate };
}
