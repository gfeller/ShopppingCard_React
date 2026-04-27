import { AppBar, Button, IconButton, Toolbar } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Editicon from "@mui/icons-material/Edit";
import Shareicon from "@mui/icons-material/Share";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { useNavigate } from "react-router-dom";
import { useListStore } from "../state/list-store";
import { useAuthStore, isConnected, displayName } from "../state/auth-store";
import { useUiStore } from "../state/ui-store";
import { useWithMessage } from "../hooks/use-with-message";

export const Appbar = () => {
  const navigate = useNavigate();
  const currentListId = useListStore((s) => s.currentListId);
  const setCurrentList = useListStore((s) => s.setCurrentList);
  const connected = useAuthStore(isConnected);
  const name = useAuthStore(displayName);
  const online = useUiStore((s) => s.online);
  const toggleListEdit = useUiStore((s) => s.toggleListEdit);

  const shareData = {
    title: "Use this link to share this list",
    text: "Add a shared List",
    url: window.location.pathname.replace("list", "share"),
  };

  const shareList = useWithMessage(
    () => navigator.share(shareData),
    null,
    'Der Browser unterstützt die Funktion nicht.'
  );

  const navigateHome = () => {
    setCurrentList(undefined);
    navigate("/");
  };

  const navigateUser = () => {
    setCurrentList(undefined);
    navigate("/user");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton size="large" edge="start" color="inherit" aria-label="home" sx={{ mr: 2 }} onClick={navigateHome}>
            <HomeIcon />
          </IconButton>

          {currentListId && (
            <div>
              <IconButton color="inherit" aria-label="share" onClick={() => shareList()}><Shareicon /></IconButton>
              <IconButton color="inherit" aria-label="edit" onClick={() => toggleListEdit()}><Editicon /></IconButton>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              data-testid="login-name"
              sx={{ textTransform: "none" }}
              color="inherit"
              startIcon={connected ? <LinkIcon /> : <LinkOffIcon />}
              onClick={navigateUser}
            >
              {name}
            </Button>
            {online ? <CloudQueueIcon /> : <CloudOffIcon />}
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};
