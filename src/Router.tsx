
import { useContext } from 'react';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';

import Layout from './pages/Layout';

import UserContext from './context/UserContext';
import Invoices from './pages/Invoices';
import Products from './pages/Products';
import Login from './pages/login';

import { Loader } from './components/Loader';
import SendInvoice from './pages/NewInvoice';

function ProtectedRoute({ children }: any) {
  const { user } = useContext(UserContext);

  if (!user ) {
    return window.location.href = '/login';
  }

  return children;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/invoices/new" element={<ProtectedRoute><SendInvoice /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
    </Route>
  )
);

export default function Router() {
  const { loading } = useContext(UserContext);

  if (loading) {
    return <Loader />;
  }

  return <RouterProvider router={router} />;
}
