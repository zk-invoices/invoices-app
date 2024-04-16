import NiceModal from '@ebay/nice-modal-react';
import { initializeApp } from 'firebase/app';
import { Toaster } from 'react-hot-toast';

import { UserProvider } from './context/UserContext';
import Router from './Router';

import ProductSearchModal from './components/ProductSearchModal';
import InvoiceAccountModal from './components/InvoiceAccountModal';
import TransactionsDrawer from './components/TransactionsDrawer';
import CreateClientModal from './components/CreateClientModal';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
};

// Initialize Firebase
initializeApp(firebaseConfig);

NiceModal.register('product-search-modal', ProductSearchModal);
NiceModal.register('invoice-account-modal', InvoiceAccountModal);
NiceModal.register('transaction-drawer', TransactionsDrawer);
NiceModal.register('add-new-client-modal', CreateClientModal);

export default function AppContainer() {
  return (
    <UserProvider>
      <NiceModal.Provider>
        <Toaster position="bottom-right" />
        <Router />
      </NiceModal.Provider>
    </UserProvider>
  );
}
