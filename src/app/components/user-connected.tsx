import { Box, Button, TextField } from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import { useAuthStore, useAuthActions, displayName } from '../state/auth-store';
import { useWithMessage } from '../hooks/use-with-message';

export const UserConnected = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const name = useAuthStore(displayName);
  const authActions = useAuthActions();
  const resetPwdMail = useWithMessage(authActions.resetPwdMail, 'Email wurde verschickt', 'Email konnte nicht verschickt werden');
  const updateProfile = useWithMessage(authActions.updateProfile, 'Anzeigename gespeichert', (e) => e.message);
  const updatePassword = useWithMessage(authActions.updatePassword, 'Passwort geändert', (e) => e.message);

  const [userDisplayName, setUserDisplayName] = useState('');
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');

  useEffect(() => {
    setUserDisplayName(name || '');
  }, [name]);

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
    <Box sx={{ display: "grid", gap: 2, alignItems: "center", width: "100%", gridTemplateColumns: "auto 1fr" }}>
      E-Mail
      <TextField variant="outlined" type="email" label="E-mail"
        value={currentUser?.email} disabled />

      Anzeigename
      <form onSubmit={handleChangeDisplayname} id="displayNameForm">
        <TextField variant="outlined" type="text" label="Anzeigename"
          sx={{ width: "100%" }}
          value={userDisplayName} onChange={(e) => setUserDisplayName(e.target.value)} required />
      </form>
      <Button sx={{ gridColumn: "1 / -1" }} type="submit" form="displayNameForm">Anzeigename übernehmen</Button>

      Passwort
      <Box component="form" onSubmit={handleChangePwd} id="resetPwdForm" sx={{ display: "flex", flexDirection: "column" }}>
        <TextField variant="outlined" type="password" label="Passwort Alt"
          value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} required />
        <TextField variant="outlined" type="password" label="Passwort Neu"
          value={newPwd} onChange={(e) => setNewPwd(e.target.value)} required />
      </Box>

      <Button sx={{ gridColumn: "1 / -1" }} type="submit" form="resetPwdForm">Passwort wechseln</Button>
      <Button sx={{ gridColumn: "1 / -1" }} type="button" onClick={handleResetPwd}>Passwort zurücksetzen</Button>
    </Box>
  );
};
