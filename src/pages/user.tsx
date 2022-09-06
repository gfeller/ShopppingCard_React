import {Button, Card, CardActions, CardContent, TextField, Typography,} from "@mui/material";
import {observer} from "mobx-react-lite";
import React, {FormEvent, useEffect, useState} from "react";
import {Severity} from "../interfaces/message";
import {useRootStore} from "../state/root-store";
import "./user.css";
import {OnlyAnonymous, OnlyUser} from "../components/only-user";

export const User = observer(() => {
  const store = useRootStore();

  const [email, setEmail] = useState("");
  const [pwd, setPassword] = useState("");

  const [displayName, setDisplayName] = useState("");

  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");

  useEffect(() => {
    setDisplayName(store.authStore.displayName || "");
  }, [store.authStore.displayName]);

  const connectUser = (event: FormEvent) => {
    event.preventDefault();
    if ((event.nativeEvent as any).submitter.value === "true") {
      store.authService.connectUser({ email, pwd });
    } else {
      store.authService.login({ email, pwd });
    }
  };

  const resetPwd = (event: FormEvent) => {
    event.preventDefault();
    const email = store.authStore.currentUser?.email;
    if (email) {
      store.authService
        .resetPwdMail(email)
        .then(() => {
          store.uiStore.setMessage({
            text: "Email wurde verschickt",
            severity: Severity.success,
          });
        })
        .catch(() => {
          store.uiStore.setMessage({
            text: "Email konnte nicht verschickt werden",
            severity: Severity.error,
          });
        });
    }
  };

  const changeDisplayname = (event: FormEvent) => {
    event.preventDefault();
    store.authService
      .changeUser({
        displayName,
        pwd: "",
        pwdOld: "",
        email: "",
      })()
      .then(() => {
        store.authStore.setUser(store.authService.auth.currentUser!);
        store.uiStore.setMessage({
          text: "Anzeigename wurde geändert",
          severity: Severity.success,
        });
      })
      .catch((error: Error) => {
        store.uiStore.setMessage({
          text: error.message,
          severity: Severity.error,
        });
      });
  };

  const changePwd = (event: FormEvent) => {
    event.preventDefault();
    store.authService
      .changeUser({
        displayName: store.authStore.currentUser?.displayName || "",
        pwd: newPwd,
        pwdOld: oldPwd,
        email: store.authStore.currentUser!.email!,
      })()
      .then(() => {
        store.authStore.setUser(store.authService.auth.currentUser!);
        store.uiStore.setMessage({
          text: "Password wurde geändert",
          severity: Severity.success,
        });
      })
      .catch((error: Error) => {
        store.uiStore.setMessage({
          text: error.message,
          severity: Severity.error,
        });
      });
  };

  return (
    <>
      <div
        style={{
          padding: "10px",
          textAlign: "start",
        }}
      >
        <Typography variant="h5">Benutzer Informationen</Typography>
        <div className="cardContainer">
          <OnlyAnonymous>
            <Card className="card">
              <CardContent>
                <Typography className="cardTitel">
                  Dieser Account ist nicht mit einer E-Mail verbunden
                </Typography>
                <Typography>
                  Listen können verloren gehen! Sie können ihren Account mit einem neuem Account verbinden oder sich mit einem bestehemden Account anmelden.
                </Typography>
                <form
                  onSubmit={connectUser}
                  style={{ display: "flex", flexDirection: "column", alignItems: "start"}}
                >
                  <TextField variant="outlined" type="email" label="E-Mail" className="textField" value={email} onChange={(e) => setEmail(e.target.value)} name="email" required />
                  <TextField variant="outlined" type="password" label="Passwort" className="textField" value={pwd} onChange={(e) => setPassword(e.target.value)} name="password" required/>
                  <div style={{ paddingTop: "10px" }}>
                    <Button type="submit" value="true">
                      Neuer Account Erstellen
                    </Button>
                    <Button type="submit" value="false">
                      Anmelden
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </OnlyAnonymous>
          <OnlyUser>
            <Card className="card">
              <CardContent>
                <Typography className="cardTitel">
                  Anzeigename ändern
                </Typography>
                <form
                  style={{ display: "flex", flexDirection: "column", alignItems: "start", }}
                  onSubmit={changeDisplayname}
                >
                  <TextField variant="outlined" type="email" label="E-mail" className="textField" value={store.authStore.currentUser?.email} disabled />
                  <TextField variant="outlined" type="text" label="Anzeigename" className="textField" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                  <Button type="submit">Änderung übernehmen</Button>
                </form>
              </CardContent>
            </Card>
          </OnlyUser>
          <OnlyUser>
            <Card className="card">
              <CardContent>
                <Typography className="cardTitel">Passwort ändern</Typography>
                <form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                  onSubmit={changePwd}
                >
                  <TextField
                    variant="outlined" type="password" label="Passwort Alt" className="textField" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} required
                  />
                  <TextField variant="outlined" type="password" label="Passwort Neu" className="textField" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} required />
                  <Button type="submit">Passwort wechseln</Button>
                </form>
              </CardContent>
            </Card>
          </OnlyUser>
          <OnlyUser>
            <Card className="card">
              <CardContent>
                <Typography className="cardTitel">Passwort vergessen?</Typography>
                <form style={{ display: "flex", flexDirection: "column", alignItems: "start"}} onSubmit={resetPwd}>
                  <Button type="submit">Passwort zurücksetzen</Button>
                </form>
              </CardContent>
            </Card>
          </OnlyUser>
          <Card className="card">
            <CardContent>
              <Typography className="cardTitel">Push-Nachrichten</Typography>
              <Typography>
                Push Nachrichten sind deaktiviert. Sie können Push-Nachrichten
                aktivieren. Sie werden benachrichtet wenn neue Einträge erfasst
                werden.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                onClick={() =>
                  !store.uiStore.notificationAccess
                    ? store.messageService.requestPermission()
                    : store.messageService.removePermission()
                }
              >
                {!store.uiStore.notificationAccess
                  ? "Benachrichtigungen aktivieren"
                  : " Keine Benachrichtigungen mehr erhalten."}
              </Button>
            </CardActions>
          </Card>
        </div>
      </div>
      <div></div>
    </>
  );
});
