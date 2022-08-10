import {observer} from "mobx-react-lite";
import {useRootStore} from "../state/root-store";
import React, { FormEvent, useEffect } from "react";
import {
    BottomNavigation, BottomNavigationAction,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl, IconButton, List,
    ListItem, ListItemButton, ListItemIcon, ListItemText,
    Paper,
    TextField
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Item } from "../model/item";

export const ShoppingList = observer(() => {
    const store = useRootStore();

    const [open, setOpen] = React.useState(false);
    const [text, setText] = React.useState<string>('');
    const [newItem, setNewItem] = React.useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (cancel: boolean) => {
        if (cancel) {
            setOpen(false);
        }
        setOpen(false);
        if (text !== '') {

            store.listService.addList(text)
            setText('');
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (newItem && store.listStore.currentListId) store.itemService.add(new Item(newItem, store.listStore.currentListId));
        setNewItem('');
    }

    return <div style={{position: 'relative', display: 'flex', flexDirection: 'column', maxHeight: '100%', height: '100%', overflow: 'auto'}}>
        <div style={{overflow: 'auto', flex: '1 1 100%'}}>
            {store.listStore.currentListId ? 
            <>
            {Object.values(store.itemStore.items).filter((x: Item) => x.listId === store.listStore.currentListId!).length > 0 ?
                <List>
                {Object.entries(store.itemStore.items).map(([key, item]) => 
                (item.listId === store.listStore.currentListId) && <ListItem disablePadding key={key}>
                    <ListItemButton>
                        <ListItemText primary={item.description}/>
                            <IconButton onClick={() => console.log('delete')}>
                                <DeleteIcon/>
                            </IconButton>
                        </ListItemButton>
                    </ListItem>
                )}
                </List>
                :
                <>
                Liste ist noch Leer!
                </>
            }           
            
            </>
            : 
            <>
            Keine Liste ausgewählt. Erstellen Sie doch eine neue!
            </>
            }
        </div>
        
        <Paper elevation={3}>
        <form onSubmit={(e: FormEvent) => handleSubmit(e)} style={{display: 'flex', margin: '5px'}}>
                <TextField id="standard-basic" label="Wir brauchen" variant="standard" value={newItem} required onChange={(e)=>setNewItem(e.target.value)}  style={{flex: '1'}}/>
                <IconButton aria-label="add Item" type="submit">
                    <AddIcon />
                </IconButton>
            </form>
        <BottomNavigation sx={{overflowX: "auto", marginRight: 0}}
                          showLabels
                          value={store.listStore.currentListId}
                          onChange={(event, newValue) => {
                              if (newValue) {
                                  store.listStore.setCurrentList(newValue);
                              }
                          }}>
            {store.listStore.items.map(list => <BottomNavigationAction key={list.id} value={list.id} label={list.description}/>)}
            <BottomNavigationAction icon={<AddIcon/>} value={null} onClick={() => handleClickOpen()}/>
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
