import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { FormEvent, useState } from "react";
import { useRootStore } from "../state/root-store";
import "./user.css";

export const User = observer(() => {
  const store = useRootStore();

  const [email, setEmail] = useState('');
  const [pwd, setPassword] = useState('');

  const connectUser = (event: FormEvent) => {
    event.preventDefault()
    if ((event.nativeEvent as any).submitter.value === "true") {
      store.authService.connectUser({ email, pwd });
    } else {
      store.authService.login({ email, pwd })
    }
  }

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
          {!store.authStore.isConnected && <Card className="card">
            <CardContent>
              <Typography className="cardTitel">
                Dieser Account ist nicht mit einer E-Mail verbunden
              </Typography>
              <Typography>
                Listen können verloren gehen! Sie können ihren Account mit einem
                neuem Account verbinden oder sich mit einem bestehemden Account
                anmelden.
              </Typography>
              <form onSubmit={connectUser}>
                <TextField
                  variant="outlined"
                  type="email"
                  label="E-Mail"
                  className="textField"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  required
                />
                <TextField
                  variant="outlined"
                  type="password"
                  label="Passwort"
                  className="textField"
                  value={pwd}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  required
                />
                <div>
                  <Button type="submit" value="true">Neuer Account Erstellen</Button>
                  <Button type="submit" value="false">Anmelden</Button>
                </div>

              </form>
            </CardContent>
          </Card>}
          <Card className="card">
            <CardContent>
              <Typography className="cardTitel">Passwort vergessen?</Typography>
              <TextField
                variant="outlined"
                type="email"
                label="E-Mail"
                className="textField"
              />
            </CardContent>
            <CardActions>
              <Button>Passwort zurücksetzen</Button>
            </CardActions>
          </Card>
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
              <Button>Benachrichtigungen aktivieren</Button>
            </CardActions>
          </Card>
        </div>
      </div>
      <div></div>
    </>
  );
});
