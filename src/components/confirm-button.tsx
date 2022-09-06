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

} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import {useTmpState} from "../hooks/use-temp-state";



export const ConfirmButton = ({label, deleteFn} : {label: string, deleteFn : () => void}) => {
  const {state, setState} = useTmpState(false, 2000);

  const onDelete = () => {
    if (state) {
      deleteFn();
    }
    setState(true)
  }

  return <Button sx={{color: state ? "red" : "orangered"}}
                 startIcon={<DeleteIcon/>}
                 onClick={onDelete}>
    {state ? `${label} Löschen` : "Löschen bestätigen"}
  </Button>
};
