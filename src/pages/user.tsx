import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import "./user.css";

export const User = () => {
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
          <Card className="card">
            <CardContent>
              <Typography className="cardTitel">
                Dieser Account ist nicht mit einer E-Mail verbunden
              </Typography>
              <Typography>
                Listen können verloren gehen! Sie können ihren Account mit einem
                neuem Account verbinden oder sich mit einem bestehemden Account
                anmelden.
              </Typography>
              <TextField
                variant="outlined"
                type="email"
                label="E-Mail"
                className="textField"
              />
              <TextField
                variant="outlined"
                type="password"
                label="Passwort"
                className="textField"
              />
            </CardContent>
            <CardActions>
              <Button>Neuer Account Erstellen</Button>
              <Button>Anmelden</Button>
            </CardActions>
          </Card>
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
};
