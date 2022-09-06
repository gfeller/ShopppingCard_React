import {Alert, Snackbar} from "@mui/material";
import {observer} from "mobx-react-lite";
import React from "react";
import {Outlet} from "react-router-dom";
import {Appbar} from "../components/app-bar";
import {useRootStore} from "../state/root-store";

import "./layout.css";

export const Layout = observer(() => {
  const store = useRootStore();

  return (
    <div className="layout">
      <Snackbar
        anchorOrigin={{horizontal: "right", vertical: "top"}}
        open={store.uiStore.message.show}
        autoHideDuration={6000}
        onClose={store.uiStore.resetMessage}
      >
        <Alert
          onClose={store.uiStore.resetMessage}
          severity={store.uiStore.message.severity}
          sx={{ width: "100%" }}
        >
          {store.uiStore.message.text}
        </Alert>
      </Snackbar>
      <Appbar />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          maxHeight: "100%",
          height: "100%",
          overflow: "auto",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
});
