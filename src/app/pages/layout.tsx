import { Alert, Box, Snackbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Appbar } from "../components/app-bar";
import { useUiStore, useUiActions } from "../state/ui-store";

export const Layout = () => {
  const message = useUiStore((s) => s.message);
  const { resetMessage } = useUiActions();

  return (
    <Box sx={{
      display: "grid",
      height: "100dvh",
      maxHeight: "100dvh",
      gridTemplateAreas: '"toolbar" "content"',
      gridTemplateRows: "auto 1fr"
    }}>
      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        open={message.show}
        autoHideDuration={6000}
        onClose={resetMessage}
      >
        <Alert
          onClose={resetMessage}
          severity={message.severity}
          sx={{ width: "100%" }}
        >
          {message.text}
        </Alert>
      </Snackbar>
      <Appbar />
      <Box sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
        height: "100%",
        overflow: "auto",
      }}>
        <Outlet />
      </Box>
    </Box>
  );
};
