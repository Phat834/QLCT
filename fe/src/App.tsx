import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TransactionList from './pages/TransactionList';
import TransactionForm from './pages/TransactionForm';
import WalletList from './pages/WalletList';
import CategoryList from './pages/CategoryList';
import BudgetList from './pages/BudgetList';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'transactions', element: <TransactionList /> },
      { path: 'transactions/new', element: <TransactionForm /> },
      { path: 'transactions/:id/edit', element: <TransactionForm /> },
      { path: 'wallets', element: <WalletList /> },
      { path: 'categories', element: <CategoryList /> },
      { path: 'budgets', element: <BudgetList /> },
    ],
  },
]);

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
