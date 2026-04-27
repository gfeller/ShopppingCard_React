import AddIcon from "@mui/icons-material/Add";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
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
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { ConfirmButton } from "../components/confirm-button";
import { useListStore } from "../state/list-store";
import { useItemStore } from "../state/item-store";
import { useUiStore } from "../state/ui-store";

export const ShoppingList = () => {
  const lists = useListStore((s) => s.items);
  const currentListId = useListStore((s) => s.currentListId);
  const setCurrentList = useListStore((s) => s.setCurrentList);
  const addList = useListStore((s) => s.addList);
  const updateList = useListStore((s) => s.updateList);
  const removeList = useListStore((s) => s.removeList);
  const items = useItemStore((s) => s.items);
  const addItem = useItemStore((s) => s.addItem);
  const removeItem = useItemStore((s) => s.removeItem);
  const toggleBought = useItemStore((s) => s.toggleBought);
  const showListEdit = useUiStore((s) => s.showListEdit);
  const toggleListEdit = useUiStore((s) => s.toggleListEdit);

  const [open, setOpen] = useState(false);
  const [text, setText] = useState<string>("");
  const [newItem, setNewItem] = useState("");
  const navigate = useNavigate();
  const urlParams = useParams();

  const handleClose = (cancel: boolean) => {
    const newText = text;
    setText("");
    setOpen(false);
    if (cancel) return;
    if (newText !== "") {
      addList(newText);
    }
  };

  const handleEditClose = (save: boolean) => {
    const newText = text;
    setText("");
    toggleListEdit();
    if (!save) return;
    if (newText !== "") {
      const list = lists.find((x) => x.id === currentListId);
      if (list) updateList({ ...list, description: newText });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newItem && currentListId) {
      addItem({ description: newItem, listId: currentListId });
    }
    setNewItem("");
  };

  const handleBottomNavigation = (newValue: string) => {
    navigate(`./${newValue}`);
  };

  const deleteList = () => {
    removeList(currentListId!);
    setCurrentList(undefined);
    toggleListEdit();
  };

  const deleteItem = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    removeItem(id);
  };

  useEffect(() => {
    if (urlParams.id) setCurrentList(urlParams.id);
  }, [urlParams.id]);

  return (
    <>
      <div style={{ overflow: "auto", flex: "1 1 100%" }}>
        {currentListId ? (
          <>
            {Object.values(items).filter((x) => x.listId === currentListId).length > 0 ? (
              <List>
                {Object.values(items)
                  .sort((a, b) => b.createdAt!.seconds - a.createdAt!.seconds)
                  .map(
                    (item) =>
                      item.listId === currentListId && (
                        <ListItem
                          disablePadding
                          key={item.id}
                          className={item.boughtAt ? "opacity-50" : ""}
                        >
                          <ListItemButton onClick={() => toggleBought(item)}>
                            {item.boughtAt ? <AddShoppingCartIcon /> : <CheckIcon />}
                            <ListItemText primary={item.description} />
                            {item.boughtAt ? (
                              <p>{moment(item.boughtAt.toMillis()).fromNow()}</p>
                            ) : (
                              <IconButton onClick={(e) => deleteItem(e, item.id!)}>
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </ListItemButton>
                        </ListItem>
                      )
                  )}
              </List>
            ) : (
              <Typography sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                Liste ist noch Leer!
              </Typography>
            )}
          </>
        ) : (
          <Typography sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            Keine Liste ausgewählt. Erstellen Sie doch eine neue!
          </Typography>
        )}
      </div>

      <Paper elevation={3}>
        {currentListId && (
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
          value={currentListId}
          onChange={(_, newValue) => {
            if (newValue) {
              setCurrentList(newValue);
              handleBottomNavigation(newValue);
            }
          }}
        >
          {lists.map((list) => (
            <BottomNavigationAction key={list.id} value={list.id} label={list.description} />
          ))}
          <BottomNavigationAction
            className="addNewList"
            icon={<PlaylistAddIcon />}
            value={null}
            onClick={() => setOpen(true)}
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
          <Button data-testid="createNewList" onClick={() => handleClose(false)}>
            Erfassen
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showListEdit} onClose={() => handleEditClose(false)}>
        <DialogTitle>Liste Anpassen</DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
            <TextField
              onChange={(event) => setText(event.target.value)}
              autoFocus
              margin="dense"
              id="name"
              label="Name ändern"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={lists.find((x) => x.id === currentListId)?.description}
            />
            <Button onClick={() => handleEditClose(true)}>Änderungen übernehmen</Button>
            <ConfirmButton label="Liste" deleteFn={deleteList} />
            <Button onClick={() => handleEditClose(false)}>Abbruch</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
