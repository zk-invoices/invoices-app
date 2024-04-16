import { useFormik } from 'formik';
import * as yup from 'yup';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Client } from '../pages/ClientsPage';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  phone: yup.string().required('Phone is required'),
  company: yup.string().required('Company is required'),
  address: yup.string().required('Address is required'),
});

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

const AddClientModal = NiceModal.create(() => {
  const modal = useModal();

  const formik = useFormik({
    initialValues: {
      avatar: '',
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values: Client) => {
      try {
        await addDoc(collection(getFirestore(), 'clients'), values);
        modal.hide();
      } catch (error) {
        console.error('Error adding document: ', error);
      }
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
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new client.
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
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              <ErrorMessage formik={formik} name="name" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="email">
                Email
              </Label>
              <Input
                className="col-span-3"
                id="email"
                name="email"
                required
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              <ErrorMessage formik={formik} name="email" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="phone">
                Phone
              </Label>
              <Input
                className="col-span-3"
                id="phone"
                name="phone"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
              />
              <ErrorMessage formik={formik} name="phone" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="company">
                Company
              </Label>
              <Input
                className="col-span-3"
                id="company"
                name="company"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.company}
              />
              <ErrorMessage formik={formik} name="company" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="address">
                Address
              </Label>
              <Input
                className="col-span-3"
                id="address"
                name="address"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
              />
              <ErrorMessage formik={formik} name="address" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Client</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export default AddClientModal;
