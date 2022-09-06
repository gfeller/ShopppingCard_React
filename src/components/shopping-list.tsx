import { observer } from "mobx-react-lite";
import { useRootStore } from "../state/root-store";
import React from "react";
import {
  BottomNavigation, BottomNavigationAction,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText,
  TextField
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { Item } from "../model/item";

export const ShoppingList = observer(() => {
  const store = useRootStore();

  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState<string>('');


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (cancel: boolean) => {
    if (cancel) {
      return;
    }
    setOpen(false);
    if (text !== '') {

      store.listService.addList(text)
      setText('');
    }
  };

  return <div className="App">
    {store.listStore.currentListId}
    <List>
      {Object.entries(store.itemStore.items).map(([key, item]) => <ListItem disablePadding>
        <ListItemButton>
          <ListItemText primary={item.description} />
        </ListItemButton>
      </ListItem>)
      }
    </List>
    <Button variant="contained" onClick={() => store.itemService.add(new Item("test desc", "9H0HkVSfSsH89eK5aBh1"))}>test</Button>

    <BottomNavigation sx={theme => ({ "overflowX": "auto" })}
      showLabels
      value={store.listStore.currentListId}
      onChange={(event, newValue) => {
        if (newValue) {
          store.listStore.setCurrentList(newValue);
        }
      }}>
      {store.listStore.items.map(list => <BottomNavigationAction value={list.id} label={list.description} />)}
      {store.listStore.items.length < 3 ?
        <BottomNavigationAction icon={<AddIcon />} value={null} onClick={() => handleClickOpen()} /> : undefined}
    </BottomNavigation>

    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Name der Shopping Liste?
        </DialogContentText>
        <TextField
          onChange={(event) => setText(event.target.value)}
          autoFocus
          margin="dense"
          id="name"
          label="Name vom Shop"
          type="email"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(true)}>Abbruch</Button>
        <Button onClick={() => handleClose(false)}>Erfassen</Button>
      </DialogActions>
    </Dialog>
  </div>
});
