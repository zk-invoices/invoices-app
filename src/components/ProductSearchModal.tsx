import { Fragment } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';

const products = [
  {
    id: 1,
    name: 'Product #1',
    price: 10
  },
  {
    id: 2,
    name: 'Product #2',
    price: 20,
  }
];

const ProductSearchModal = NiceModal.create(() => {
  const modal = useModal();

  function handleSelect(product: unknown) {
    modal.resolve(product);
    modal.remove();
  }

  return (
    <Transition appear show={modal.visible} as={Fragment}>
      <Dialog as="div" className="relative z-8" onClose={modal.remove}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-16 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white px-6 py-8  text-left align-middle shadow-xl transition-all space-y-4">
                <div className="flex flex-row justify-between">
                  <Dialog.Title
                    as="h2"
                    className="text-2xl font-medium text-gray-900"
                  >
                    Products
                  </Dialog.Title>
                </div>
                <Dialog.Description
                  as="p"
                  className="text-center px-8 mt-4 text-gray-400"
                ></Dialog.Description>
                { products.map((p) => {
                  return <Card key={p.id} onClick={() => handleSelect(p)} className='hover:shadow-lg pointer'>
                    <CardContent className="pt-4">
                      <p className="text-lg">{p.name}</p>
                    </CardContent>
                    <CardFooter >
                    <p className="text-base">Price: {p.price}</p>
                    </CardFooter>
                  </Card>
                }) }
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
});

export default ProductSearchModal;
