import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { useFormik } from 'formik';
import * as yup from 'yup';

const ErrorMessage = ({ formik, name }: { formik: any; name: string }) => {
  if (formik.touched[name] && formik.errors[name]) {
    return (
      <small className="col-span-3 col-start-2 text-red-500">
        {formik.errors[name]}
      </small>
    );
  }
  return null;
};

const CreateNewProductModal = NiceModal.create(() => {
  const modal = useModal();

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      image: null,
    },
    validationSchema: yup.object({
      name: yup.string().required('Name is required'),
      price: yup
        .number()
        .required('Price is required')
        .positive('Price must be positive'),
    }),
    onSubmit: (values) => {
      console.log('form submitted');
      modal.resolve(values);
      modal.remove();
    },
  });

  return (
    <Dialog
      open={modal.visible}
      onOpenChange={(open) => !open && modal.remove()}
    >
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new product.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="name">
                Name
              </Label>
              <Input
                className="col-span-3"
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              <ErrorMessage formik={formik} name="name" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="price">
                Price
              </Label>
              <Input
                className="col-span-3"
                id="price"
                name="price"
                required
                step="0.01"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.price}
              />
              <ErrorMessage formik={formik} name="price" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="image">
                Image
              </Label>
              <div className="col-span-3">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  onChange={(event) => {
                    if (event.currentTarget.files) {
                      formik.setFieldValue(
                        'image',
                        event.currentTarget.files[0]
                      );
                    }
                  }}
                />
              </div>
              <ErrorMessage formik={formik} name="image" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export default CreateNewProductModal;
