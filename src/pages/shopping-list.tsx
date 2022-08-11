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
    TextField,
    Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Item } from "../model/item";
import { ItemService } from "../services/item.service";

export const ShoppingList = observer(() => {
    const store = useRootStore();

    const [open, setOpen] = React.useState(false);
    const [text, setText] = React.useState<string>('');
    const [newItem, setNewItem] = React.useState('');

    const deleteOptions = ['Liste löschen', 'Löschen bestätigen']

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

    const handleListEditClose = () => {
        store.uiStore.toggleListEdit()


    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (newItem && store.listStore.currentListId) store.itemService.add(new Item(newItem, store.listStore.currentListId));
        setNewItem('');
    }

    const deleteList = () => {
        store.listService.remove(store.listStore.currentListId!);
        store.listStore.setCurrentList('');
        store.uiStore.toggleListEdit();
    }

    return <div style={{position: 'relative', display: 'flex', flexDirection: 'column', maxHeight: '100%', height: '100%', overflow: 'auto'}}>
        <div style={{overflow: 'auto', flex: '1 1 100%'}}>
            {store.listStore.currentListId ? 
            <>
            {Object.values(store.itemStore.items).filter((x: Item) => x.listId === store.listStore.currentListId!).length > 0 ?
                <List>
                {Object.values(store.itemStore.items).map((item) => 
                (item.listId === store.listStore.currentListId) && <ListItem disablePadding key={item.id}>
                    <ListItemButton>
                        <ListItemText primary={item.description}/>
                            <IconButton onClick={() => store.itemService.remove(item.id!)}>
                                <DeleteIcon/>
                            </IconButton>
                        </ListItemButton>
                    </ListItem>
                )}
                </List>
                :
                <Typography sx={{paddingTop: '50%'}}>
                Liste ist noch Leer!
                </Typography>
            }           
            
            </>
            : 
            <Typography sx={{paddingTop: '50%'}}>
            Keine Liste ausgewählt. Erstellen Sie doch eine neue!
            </Typography>
            }
        </div>
        
        <Paper elevation={3}>
        {store.listStore.currentListId &&  <form onSubmit={(e: FormEvent) => handleSubmit(e)} style={{display: 'flex', margin: '5px'}}>
                <TextField id="standard-basic" label="Wir brauchen" variant="standard" value={newItem} required onChange={(e)=>setNewItem(e.target.value)}  style={{flex: '1'}}/>
                <IconButton aria-label="add Item" type="submit">
                    <AddIcon />
                </IconButton>
            </form>}
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

        <Dialog open={store.uiStore.showListEdit} onClose={handleListEditClose}>
            <DialogTitle>Liste Anpassen</DialogTitle>
            <DialogContent>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
                <TextField
                    onChange={(event) => setText(event.target.value)}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name ändern"
                    type="text"
                    fullWidth
                    variant="standard"
                    defaultValue={store.listStore.items.find((x) => x.id == store.listStore.currentListId)?.description}

                />
                
                    <Button onClick={handleListEditClose}>Änderungen übernehmen</Button>
                    <Button 
                        sx={{color: 'red'}}
                        startIcon={<DeleteIcon />}
                        onClick={deleteList}
                        >
                        {deleteOptions[0]}
                    </Button>
                    <Button onClick={handleListEditClose}>Abbruch</Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
});
