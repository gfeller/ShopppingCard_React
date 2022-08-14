import { observer } from "mobx-react-lite";
import { useRootStore } from "../state/root-store";
import React, { FormEvent, useEffect, useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { Item } from "../model/item";
import { Timestamp } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

export const ShoppingList = observer(() => {
  const store = useRootStore();

  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState<string>("");
  const [newItem, setNewItem] = React.useState("");
  let navigate = useNavigate();
  let urlParams = useParams();
  const [confirmDelete, setConfirmDelete] = useState(0);

  const deleteOptions = ["Liste löschen", "Löschen bestätigen"];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (cancel: boolean) => {
    const newText = text;
    setText("");
    setOpen(false);
    if (cancel) return;
    if (text !== "") {
      store.listService.addList(newText);
    }
  };

  const handleEditClose = (save: boolean) => {
    const newText = text;
    setText("");
    setConfirmDelete(0);
    store.uiStore.toggleListEdit();
    if (!save) return;
    if (text !== "") {
      let list = store.listStore.items.find(
        (x) => x.id === store.listStore.currentListId
      );
      list!.description = newText;
      store.listService.update(list!);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newItem && store.listStore.currentListId)
      store.itemService.add(new Item(newItem, store.listStore.currentListId));
    setNewItem("");
  };

  const handleBottomNavigation = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: string
  ) => {
    navigate(`./${newValue}`);
  };

  const buyItem = (item: Item) => {
    item.boughtAt = Timestamp.now();
    store.itemService.update(item);
  };

  const deleteList = () => {
    if (confirmDelete) {
      store.listService.remove(store.listStore.currentListId!);
      store.listStore.setCurrentList("");
      store.uiStore.toggleListEdit();
      setConfirmDelete(0);
      return;
    }
    setConfirmDelete(1);
  };

  useEffect(() => {
    if (urlParams.id) store.listStore.setCurrentList(urlParams.id);
  }, [store.listStore, urlParams.id]);

  return (
    <>
      <div style={{ overflow: "auto", flex: "1 1 100%" }}>
        {store.listStore.currentListId ? (
          <>
            {Object.values(store.itemStore.items).filter(
              (x: Item) => x.listId === store.listStore.currentListId!
            ).length > 0 ? (
              <List>
                {Object.values(store.itemStore.items).map(
                  (item) =>
                    item.listId === store.listStore.currentListId && (
                      <ListItem disablePadding key={item.id}>
                        <ListItemButton onClick={() => buyItem(item)}>
                          <ListItemText primary={item.description} />
                          <IconButton
                            onClick={() => store.itemService.remove(item.id!)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemButton>
                      </ListItem>
                    )
                )}
              </List>
            ) : (
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                Liste ist noch Leer!
              </Typography>
            )}
          </>
        ) : (
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            Keine Liste ausgewählt. Erstellen Sie doch eine neue!
          </Typography>
        )}
      </div>

      <Paper elevation={3}>
        {store.listStore.currentListId && (
          <form
            onSubmit={(e: FormEvent) => handleSubmit(e)}
            style={{ display: "flex", margin: "auto", maxWidth: "300px" }}
          >
            <TextField
              id="standard-basic"
              label="Wir brauchen"
              variant="standard"
              value={newItem}
              required
              onChange={(e) => setNewItem(e.target.value)}
              style={{ flex: "1" }}
            />
            <IconButton aria-label="add Item" type="submit">
              <AddIcon />
            </IconButton>
          </form>
        )}
        <BottomNavigation
          sx={{ overflowX: "auto", marginRight: 0 }}
          showLabels
          value={store.listStore.currentListId}
          onChange={(event, newValue) => {
            if (newValue) {
              store.listStore.setCurrentList(newValue);
              handleBottomNavigation(event, newValue);
            }
          }}
        >
          {store.listStore.items.map((list) => (
            <BottomNavigationAction
              key={list.id}
              value={list.id}
              label={list.description}
            />
          ))}
          <BottomNavigationAction
            icon={<PlaylistAddIcon />}
            value={null}
            onClick={() => handleClickOpen()}
          />
        </BottomNavigation>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Neue Liste erfassen</DialogTitle>
        <DialogContent>
          <TextField
            onChange={(event) => setText(event.target.value)}
            autoFocus
            margin="dense"
            id="name"
            label="Name der Liste"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(true)}>Abbruch</Button>
          <Button onClick={() => handleClose(false)}>Erfassen</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={store.uiStore.showListEdit}
        onClose={() => handleEditClose(false)}
      >
        <DialogTitle>Liste Anpassen</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <TextField
              onChange={(event) => setText(event.target.value)}
              autoFocus
              margin="dense"
              id="name"
              label="Name ändern"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={
                store.listStore.items.find(
                  (x) => x.id === store.listStore.currentListId
                )?.description
              }
            />

            <Button
              onClick={() => {
                handleEditClose(true);
              }}
            >
              Änderungen übernehmen
            </Button>
            <Button
              sx={{ color: "red" }}
              startIcon={<DeleteIcon />}
              onClick={deleteList}
            >
              {deleteOptions[confirmDelete]}
            </Button>
            <Button onClick={() => handleEditClose(false)}>Abbruch</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});
