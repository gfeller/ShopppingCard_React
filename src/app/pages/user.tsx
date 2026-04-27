import { Button, TextField } from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import { Severity } from '../model/message';
import { useAuthStore, displayName } from '../state/auth-store';
import { useUiStore } from '../state/ui-store';
import { OnlyAnonymous, OnlyUser } from '../components/only-user';

export const User = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const name = useAuthStore(displayName);
  const connectUser = useAuthStore((s) => s.connectUser);
  const login = useAuthStore((s) => s.login);
  const resetPwdMail = useAuthStore((s) => s.resetPwdMail);
  const changeUser = useAuthStore((s) => s.changeUser);
  const setMessage = useUiStore((s) => s.setMessage);

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
    const promise = submitter?.value === 'create'
      ? connectUser({ email, pwd })
      : login({ email, pwd });

    promise
      .then(() => setMessage({ text: 'Angemeldet', severity: Severity.success }))
      .catch(() => setMessage({ text: 'Anmeldung fehlgeschlagen', severity: Severity.error }));
  };

  const handleResetPwd = (event: FormEvent) => {
    event.preventDefault();
    const userEmail = currentUser?.email;
    if (userEmail) {
      resetPwdMail(userEmail)
        .then(() => setMessage({ text: 'Email wurde verschickt', severity: Severity.success }))
        .catch(() => setMessage({ text: 'Email konnte nicht verschickt werden', severity: Severity.error }));
    }
  };

  const handleChangeDisplayname = (event: FormEvent) => {
    event.preventDefault();
    changeUser({ displayName: userDisplayName })
      .then(() => setMessage({ text: 'Anzeigename wurde geändert', severity: Severity.success }))
      .catch((error: Error) => setMessage({ text: error.message, severity: Severity.error }));
  };

  const handleChangePwd = (event: FormEvent) => {
    event.preventDefault();
    changeUser({ pwd: newPwd, pwdOld: oldPwd, email: currentUser!.email! })
      .then(() => setMessage({ text: 'Password wurde geändert', severity: Severity.success }))
      .catch((error: Error) => setMessage({ text: error.message, severity: Severity.error }));
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
