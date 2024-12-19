import {AppBar, Button, IconButton, Toolbar} from "@mui/material";
import {observer} from "mobx-react-lite";
import HomeIcon from "@mui/icons-material/Home";
import Editicon from "@mui/icons-material/Edit";
import Shareicon from "@mui/icons-material/Share";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import LinkIcon from "@mui/icons-material/Link";
import {useRootStore} from "../state/root-store";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import {useNavigate} from "react-router-dom";
import {Severity} from "../model/message";

export const Appbar = observer(() => {
  const store = useRootStore();
  const navigate = useNavigate();

  const navigateHome = () => {
    store.listStore.setCurrentList("");
    navigate("/");
  };

  const navigateUser = () => {
    store.listStore.setCurrentList("");
    navigate("/user");
  };

  const shareData = {
    title: "Use this link to share this list",
    text: "Add a shared List",
    url: window.location.pathname.replace("list", "share"),
  };

  const shareList = async () => {
    try {
      await navigator.share(shareData);
    } catch  {
      store.uiStore.setMessage({
        text: "Der Browser unterstützt die Funktion nicht.",
        severity: Severity.error,
      });
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton size="large" edge="start" color="inherit" aria-label="home" sx={{ mr: 2 }} onClick={navigateHome}>
            <HomeIcon />
          </IconButton>

          {store.listStore.currentListId && (
            <div>
              <IconButton color="inherit" aria-label="share" onClick={() => shareList()}><Shareicon /></IconButton>
              <IconButton color="inherit" aria-label="edit" onClick={() => store.uiStore.toggleListEdit()} ><Editicon /></IconButton>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center" }}>
            <Button data-testid="login-name" sx={{ textTransform: "none" }} color="inherit"
                    startIcon={ store.authStore.isConnected ? <LinkIcon /> : <LinkOffIcon /> }
                    onClick={navigateUser}>
              {store.authStore.displayName}
            </Button>
            {store.uiStore.online ? <CloudQueueIcon /> : <CloudOffIcon />}
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
});



