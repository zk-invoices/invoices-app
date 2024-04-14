import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from '@/components/ui/popover';
import {
  CommandInput,
  CommandEmpty,
  CommandItem,
  CommandGroup,
  Command,
} from '@/components/ui/command';
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from '@/components/ui/table';

export default function InvoiceForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Invoice</CardTitle>
        <CardDescription>
          Fill out the form to create a new invoice
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="client">Client</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Input id="client" placeholder="Select client..." />
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command className="w-full">
                  <CommandInput
                    className="h-9 w-full"
                    placeholder="Search clients..."
                  />
                  <CommandEmpty>No clients found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem>Acme Inc.</CommandItem>
                    <CommandItem>Globex Corp.</CommandItem>
                    <CommandItem>Stark Industries</CommandItem>
                    <CommandItem>Wayne Enterprises</CommandItem>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="product">Products</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="w-[200px] justify-between"
                  role="combobox"
                  variant="outline"
                >
                  Select product...
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    className="h-9"
                    placeholder="Search product..."
                  />
                  <CommandEmpty>No product found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem>Product A</CommandItem>
                    <CommandItem>Product B</CommandItem>
                    <CommandItem>Product C</CommandItem>
                    <CommandItem>Product D</CommandItem>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Button type="submit">Submit Form</Button>
          </div>
        </div>
        <div className="w-full">
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Product A</TableCell>
                <TableCell>$10.00</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline">
                      -
                    </Button>
                    <Input
                      className="w-16"
                      defaultValue="1"
                      id="quantity"
                      min="1"
                      type="number"
                    />
                    <Button size="sm" variant="outline">
                      +
                    </Button>
                  </div>
                </TableCell>
                <TableCell />
              </TableRow>
              <TableRow>
                <TableCell>Product B</TableCell>
                <TableCell>$20.00</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline">
                      -
                    </Button>
                    <Input
                      className="w-16"
                      defaultValue="1"
                      id="quantity"
                      min="1"
                      type="number"
                    />
                    <Button size="sm" variant="outline">
                      +
                    </Button>
                  </div>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex justify-end mt-4">
            <div className="flex items-center gap-2">
              <span>Total:</span>
              <span>$30.00</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChevronsUpDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  );
}
