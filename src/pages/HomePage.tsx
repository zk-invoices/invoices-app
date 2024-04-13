import { Button } from '@/components/ui/button';

import {
  CardTitle,
  CardHeader,
  CardContent,
  Card,
  CardDescription,
} from '@/components/ui/card';
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, DollarSign, Eye, FileWarning, Receipt } from 'lucide-react';
import { ReactNode, useContext, useEffect, useState } from 'react';
import {
  QuerySnapshot,
  getFirestore,
  onSnapshot,
  query,
  or,
  where,
  orderBy,
  collection,
} from 'firebase/firestore';
import { RawInvoice } from 'src/services/InvoiceService';
import { User } from 'firebase/auth';
import UserContext from '../context/UserContext';
import { getShortAddress } from '../utils/common';
import { formatDate } from 'date-fns';

type StatsCardProps = {
  title: string;
  value: string;
  meta: string;
  icon: ReactNode;
};
function StatsCard({ title, icon, value, meta }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{meta}</p>
      </CardContent>
    </Card>
  );
}

function InvoicesTable({ rows }: { rows: RawInvoice[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
        <CardDescription>View and manage your invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((invoice: RawInvoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>
                  <p>{getShortAddress(invoice.buyer, 10)}</p>
                  <small className="block">
                    ({invoice.metadata.buyerEmail})
                  </small>
                </TableCell>
                <TableCell>
                  {formatDate(invoice.dueDate.toDate(), 'dd, MMM yyyy')}
                </TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <Badge variant="default">
                    {invoice.dueDate.toDate() > new Date()
                      ? 'pending'
                      : 'overdue'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="icon" variant="outline">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [sentInvoices, setSentInvoices] = useState<any[]>([]);
  const [, setReceivedInvoices] = useState<any[]>([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const db = getFirestore();
    const userId = (user as User).uid;

    function formatInvoicesSnapshot(snap: QuerySnapshot): RawInvoice[] {
      return snap.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as RawInvoice
      );
    }

    onSnapshot(
      query(
        collection(db, 'invoices'),
        or(where('buyer', '==', userId), where('seller', '==', userId)),
        orderBy('createdAt', 'desc')
      ),
      (snap) => {
        const invoices = formatInvoicesSnapshot(snap);
        const sent: RawInvoice[] = [];
        const received: RawInvoice[] = [];

        invoices.forEach((invoice) => {
          if (invoice.buyer === userId) {
            received.push(invoice);
            return;
          }

          sent.push(invoice);
        });

        setSentInvoices(sent);
        setReceivedInvoices(received);
      }
    );
  }, []);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Invoices"
          value={sentInvoices.length.toString()}
          meta=""
          icon={
            <Receipt className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          }
        />
        <StatsCard
          title="Paid Invoices"
          value="0"
          meta=""
          icon={<Check className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
        />

        <StatsCard
          title="Unpaid"
          value={sentInvoices.length.toString()}
          meta=""
          icon={
            <FileWarning className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          }
        />
        <StatsCard
          title="Total Revenue"
          value={`$${sentInvoices.reduce((acc, cur) => acc + cur.amount, 0)}`}
          meta=""
          icon={
            <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          }
        />
      </div>
      <div className="mt-4">
        <InvoicesTable rows={sentInvoices} />
      </div>
    </div>
  );
}
