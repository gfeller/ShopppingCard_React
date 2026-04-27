import { Button, TextField } from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import { useAuthStore, displayName } from '../state/auth-store';
import { useWithMessage } from '../hooks/use-with-message';
import { OnlyAnonymous, OnlyUser } from '../components/only-user';

export const User = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const name = useAuthStore(displayName);
  const connectUser = useWithMessage(useAuthStore((s) => s.connectUser), 'Angemeldet', 'Anmeldung fehlgeschlagen');
  const login = useWithMessage(useAuthStore((s) => s.login), 'Angemeldet', 'Anmeldung fehlgeschlagen');
  const resetPwdMail = useWithMessage(useAuthStore((s) => s.resetPwdMail), 'Email wurde verschickt', 'Email konnte nicht verschickt werden');
  const updateProfile = useWithMessage(useAuthStore((s) => s.updateProfile), 'Anzeigename gespeichert', (e) => e.message);
  const updatePassword = useWithMessage(useAuthStore((s) => s.updatePassword), 'Passwort geändert', (e) => e.message);

  const [email, setEmail] = useState('');
  const [pwd, setPassword] = useState('');
  const [userDisplayName, setUserDisplayName] = useState('');
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');

  useEffect(() => {
    setUserDisplayName(name || '');
  }, [name]);

  const handleConnectUser = (event: FormEvent) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent)?.submitter as HTMLButtonElement;
    if (submitter?.value === 'create') {
      connectUser({ email, pwd });
    } else {
      login({ email, pwd });
    }
  };

  const handleResetPwd = (event: FormEvent) => {
    event.preventDefault();
    const userEmail = currentUser?.email;
    if (userEmail) resetPwdMail(userEmail);
  };

  const handleChangeDisplayname = (event: FormEvent) => {
    event.preventDefault();
    updateProfile({ displayName: userDisplayName });
  };

  const handleChangePwd = (event: FormEvent) => {
    event.preventDefault();
    updatePassword(currentUser!.email!, oldPwd, newPwd);
  };

  return (
    <>
      <div className="p-5">
        <div>
          <OnlyAnonymous>
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
          </OnlyAnonymous>
          <OnlyUser>
            <div className="grid gap-5 items-center w-full" style={{ gridTemplateColumns: 'auto 1fr' }}>
              E-Mail
              <TextField variant="outlined" type="email" label="E-mail"
                value={currentUser?.email} disabled />

              Anzeigename
              <form onSubmit={handleChangeDisplayname} id="displayNameForm">
                <TextField variant="outlined" type="text" label="Anzeigename"
                  className="w-full"
                  value={userDisplayName} onChange={(e) => setUserDisplayName(e.target.value)} required />
              </form>
              <Button className="col-span-full" type="submit" form="displayNameForm">Anzeigename übernehmen</Button>

              Passwort
              <form onSubmit={handleChangePwd} id="resetPwdForm" className="flex flex-col">
                <TextField variant="outlined" type="password" label="Passwort Alt"
                  value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} required />
                <TextField variant="outlined" type="password" label="Passwort Neu"
                  value={newPwd} onChange={(e) => setNewPwd(e.target.value)} required />
              </form>

              <Button className="col-span-full" type="submit" form="resetPwdForm">Passwort wechseln</Button>
              <Button className="col-span-full" type="button" onClick={handleResetPwd}>Passwort zurücksetzen</Button>
            </div>
          </OnlyUser>
        </div>
      </div>
    </>
  );
};
