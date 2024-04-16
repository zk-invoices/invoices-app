import { Button } from '@/components/ui/button';
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from '@/components/ui/table';
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';

import { useEffect, useState } from 'react';
import { useModal } from '@ebay/nice-modal-react';

import { collection, getDocs, getFirestore } from 'firebase/firestore';

export type Client = {
  id?: string;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
};

export default function Component() {
  const modal = useModal('add-new-client-modal');

  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const querySnapshot = await getDocs(
        collection(getFirestore(), 'clients')
      );
      const clientsList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setClients(clientsList as Client[]);
      setLoading(false);
    };

    fetchClients();
  }, []);

  function openNewClientModal() {
    modal.show();
  }

  if (loading) {
    return <p>Loading</p>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <Button size="sm" onClick={openNewClientModal}>
            Add Client
          </Button>
        </div>
        <div className="border shadow-sm rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead className="max-w-[150px]">Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage alt="Avatar" src="/placeholder-avatar.jpg" />
                      <AvatarFallback>{client.avatar}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {client.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {client.phone}
                  </TableCell>
                  <TableCell>{client.company}</TableCell>
                  <TableCell>{client.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
