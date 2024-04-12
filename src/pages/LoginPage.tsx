import UserContext from '../context/UserContext';
import {
  getAuth,
  signInWithCustomToken,
  signInWithRedirect,
} from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { useContext } from 'react';
import { Loader } from '../components/Loader';
import { Button } from '@/components/ui/button';

function LoginWithMina() {
  async function authenticate() {
    const minaProvider: any = (window as any).mina;

    if (minaProvider) {
      await minaProvider.requestAccounts();

      const sign = await (window as any).mina.signMessage({
        message: 'login to invoices',
      });

      const data = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        method: 'POST',
        body: JSON.stringify(sign),
        headers: {
          'Content-Type': 'application/json',
        },
      } as any).then((res) => res.json());

      if (!data.token) {
        return;
      }

      const auth = getAuth();
      await signInWithCustomToken(auth, data.token);
    } else {
      alert('wallet not found');
    }
  }

  return <Button onClick={authenticate}>Login with Mina</Button>;
}

export default function Login() {
  const { user, loading } = useContext(UserContext);

  function authenticate() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    signInWithRedirect(auth, provider);
  }

  if (loading) {
    return <Loader />;
  }

  if (user) {
    window.location.pathname = '/';

    return <>Hi</>;
  }

  return (
    <div className="max-w-md mx-auto mt-14 space-y-4 flex flex-col">
      <LoginWithMina />
      <Button variant="secondary" onClick={authenticate}>
        Login with google
      </Button>
    </div>
  );
}
