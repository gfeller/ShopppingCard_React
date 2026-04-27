import { Button, TextField } from '@mui/material';
import { FormEvent, useState } from 'react';
import { useAuthStore } from '../state/auth-store';
import { useWithMessage } from '../hooks/use-with-message';

export const UserAnonymous = () => {
  const connectUser = useWithMessage(useAuthStore((s) => s.connectUser), 'Angemeldet', 'Anmeldung fehlgeschlagen');
  const login = useWithMessage(useAuthStore((s) => s.login), 'Angemeldet', 'Anmeldung fehlgeschlagen');

  const [email, setEmail] = useState('');
  const [pwd, setPassword] = useState('');

  const handleConnectUser = (event: FormEvent) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent)?.submitter as HTMLButtonElement;
    if (submitter?.value === 'create') {
      connectUser({ email, pwd });
    } else {
      login({ email, pwd });
    }
  };

  return (
    <div>
      <div>Dieser Account ist nicht mit einer E-Mail verbunden</div>
      <div>Listen können verloren gehen! Sie können ihren Account mit einem neuem Account
        verbinden oder sich mit einem bestehemden Account anmelden.
      </div>
      <form onSubmit={handleConnectUser}>
        <div className="py-2">
          <TextField variant="outlined" type="email" label="E-Mail"
            value={email} onChange={(e) => setEmail(e.target.value)} name="email" required />
          <TextField variant="outlined" type="password" label="Passwort"
            value={pwd} onChange={(e) => setPassword(e.target.value)} name="password" required />
        </div>
        <div>
          <Button type="submit" value="create">Account Erstellen</Button>
          <Button type="submit" value="register">Anmelden</Button>
        </div>
      </form>
    </div>
  );
};
