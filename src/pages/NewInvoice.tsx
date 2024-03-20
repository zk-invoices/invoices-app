import { useNavigate } from "react-router-dom";
import InvoiceForm from "../components/InvoiceForm";
import { RawInvoice, createInvoice } from "../services/InvoiceService";
import { useRandomInvoice } from "../utils/useRandomInvoice";
import { useContext } from "react";
import UserContext from "../context/UserContext";

export default function SendInvoice () {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { invoice } = useRandomInvoice(user?.uid as string);
  
  async function create(invoice: RawInvoice) {
    await createInvoice(invoice);

    return navigate('/');
  }

  return <div className="space-y-4 max-w-2xl mx-auto mt-4">
    <InvoiceForm initialValue={invoice as RawInvoice} create={create}/>
  </div>
}