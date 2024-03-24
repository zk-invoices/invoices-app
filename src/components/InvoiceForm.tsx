import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';

import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { RawInvoice } from '../services/InvoiceService';
import { useModal } from '@ebay/nice-modal-react';
import { Button } from '@/components/ui/button';

type ProductDetail = {
  id: number;
  price: number;
  name: number;
};

export default function InvoiceForm({
  create,
  initialValue,
}: {
  create: (data: any) => void;
  initialValue: RawInvoice;
}) {
  const currentDate = new Date();
  const productSearchModal = useModal('product-search-modal');
  const [invoice, setInvoice] = useState(initialValue);
  const [products, setProducts] = useState<
    Record<number, { product: ProductDetail; quantity: number }>
  >({});
  const [date, setDate] = useState<Date | undefined>(currentDate);

  function handleChange(name: any, value: any) {
    setInvoice({ ...invoice, [name]: value });
  }

  function addProduct(product: ProductDetail) {
    if (products[product.id]) {
      const newProducts = Object.assign({}, products);

      newProducts[product.id].quantity++;

      setProducts(newProducts);

      return;
    }

    setProducts(
      Object.assign(
        {
          [product.id]: {
            product,
            quantity: 1,
          },
        },
        products
      )
    );
  }

  useEffect(() => {
    const totalAmount = Object.values(products).reduce((acc, { product, quantity }) => {
      acc += product.price * quantity;

      return acc;
    }, 0)

    const newInvoice = Object.assign({}, invoice);
    
    newInvoice.amount = totalAmount;

    setInvoice(newInvoice);
  }, [products])

  useEffect(() => {
    setInvoice(initialValue);
  }, [initialValue]);

  return (
    <div className="space-y-4">
      <div className="space-y-4 text-left">
        <div>
          <label className="text-sm">Buyer</label>
          <input
            id="invoice-to"
            name="to"
            className="w-full border bg-gray-50 rounded-md p-2"
            value={invoice.buyer}
            onChange={(e) => handleChange('buyer', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Items</label>
          {Object.values(products).map(({ product, quantity }) => {
            return (
              <Card key={product.id} className="shadow-none">
                <CardContent className="pt-4">
                  <p className="text-lg">{product.name}</p>
                  <p className="text-base block">Price: {product.price}</p>
                </CardContent>
                <CardFooter className='bg-gray-50 py-2'>
                  <p className="text-base block">Quantity: {quantity}</p>
                </CardFooter>
              </Card>
            );
          })}
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              productSearchModal
                .show()
                .then((product) => addProduct(product as ProductDetail))
            }
          >
            Add Product
          </Button>
        </div>
        <div>
          <label className="text-sm">Amount</label>
          <input
            id="invoice-amount"
            type="number"
            name="amount"
            className="w-full border bg-gray-50 rounded-md p-2"
            value={invoice.amount}
            onChange={(e) => handleChange('amount', Number(e.target.value))}
          />
        </div>
        <div>
          <label className="text-sm">Due Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <div
                className={cn(
                  'w-full justify-start text-left font-normal border bg-gray-50 rounded-md p-2 cursor-pointer',
                  !date && 'text-muted-foreground'
                )}
              >
                <div>
                  <CalendarIcon className="mr-2 h-4 w-4 inline mb-1" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  d && d > currentDate && setDate(d);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Button
        className="w-full"
        onClick={() => create({ ...invoice, dueDate: date })}
      >
        Create Invoice
      </Button>
    </div>
  );
}
