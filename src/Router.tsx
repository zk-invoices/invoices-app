import { useContext } from 'react';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import Layout from './pages/Layout';
import NewLayout from './pages/NewLayout';

import UserContext from './context/UserContext';
import Invoices from './pages/Invoices';
import Products from './pages/Products';
import Login from './pages/LoginPage';

import NewSendInvoice from './pages/CreateInvoicePage';
import ClientsPage from './pages/ClientsPage';
import ProductsPage from './pages/ProductsPage';

import HomePage from './pages/HomePage';

import { Loader } from './components/Loader';
import SendInvoice from './pages/NewInvoice';

function ProtectedRoute({ children }: any) {
  const { user } = useContext(UserContext);

  if (!user) {
    return (window.location.href = '/login');
  }

  return children;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<NewLayout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices/new"
          element={
            <ProtectedRoute>
              <NewSendInvoice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <ClientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/_" element={<Layout />}>
        <Route
          path="/_"
          element={
            <ProtectedRoute>
              <Invoices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/_/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/_/invoices/new"
          element={
            <ProtectedRoute>
              <SendInvoice />
            </ProtectedRoute>
          }
        />
      </Route>
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
