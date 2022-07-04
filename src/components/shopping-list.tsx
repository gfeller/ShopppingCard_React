import {observer} from "mobx-react-lite";
import {useRootStore} from "../state/root-store";
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
            {store.listStore.items.map(list => <ListItem disablePadding>
                <ListItemButton>
                    <ListItemText primary={list.description}/>
                </ListItemButton>
            </ListItem>)
            }
        </List>


        <BottomNavigation sx={theme => ({"overflowX": "auto"})}
                          showLabels
                          value={store.listStore.currentListId}
                          onChange={(event, newValue) => {
                              if (newValue) {
                                  store.listStore.setCurrentList(newValue);
                              }
                          }}>
            {store.listStore.items.map(list => <BottomNavigationAction value={list.id} label={list.description}/>)}
            {store.listStore.items.length < 3 ?
                <BottomNavigationAction icon={<AddIcon/>} value={null} onClick={() => handleClickOpen()}/> : undefined}
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
