import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from '@/components/ui/dropdown-menu';

import { Link, NavLink, Outlet } from 'react-router-dom';
import { Package, PlusIcon, Receipt, Search, Users } from 'lucide-react';
import { getAuth } from 'firebase/auth';

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
          size="icon"
          variant="ghost"
        >
          <img
            alt="Avatar"
            className="rounded-full"
            height="32"
            src="/placeholder.svg"
            style={{
              aspectRatio: '32/32',
              objectFit: 'cover',
            }}
            width="32"
          />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => getAuth().signOut()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Header() {
  return (
    <header className="flex h-[60px] lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
      <Link className="lg:hidden" to="/">
        <Receipt className="h-6 w-6" />
        <span className="sr-only">Home</span>
      </Link>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-gray-950"
              placeholder="Search invoices"
              type="search"
            />
          </div>
        </form>
      </div>
      <UserMenu />
    </header>
  );
}

function navlinkClass({ isActive }: { isActive: boolean }) {
  if (isActive) {
    return 'flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50';
  }

  return 'flex items-center gap-3 rounded-lg px-3 py-3 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50';
}

function Sidebar() {
  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold" to="/">
            <span className="">zkInvoices</span>
          </Link>
          {/* <Button className="ml-auto h-8 w-8" size="icon" variant="outline">
            <BellIcon className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button> */}
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 space-y-2 text-sm font-medium">
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 bg-gray-900 text-white transition-all hover:bg-gray-100 hover:text-gray-900"
              to="/_/invoices/new"
            >
              <PlusIcon className="h-4 w-4" />
              New Invoice
            </Link>
            <Link className={navlinkClass({ isActive: false })} to="/_">
              <Receipt className="h-4 w-4" />
              Invoices
            </Link>
            <NavLink className={navlinkClass} to="/_/products">
              <Package className="h-4 w-4" />
              Products
            </NavLink>
            <NavLink className={navlinkClass} to="/_/clients">
              <Users className="h-4 w-4" />
              Clients
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default function Layout() {
  return (
    <div
      key="1"
      className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]"
    >
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
