import React from "react";
import {Button,} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import {useTmpState} from "../hooks/use-temp-state";


export const ConfirmButton = ({label, deleteFn} : {label: string, deleteFn : () => void}) => {
  const {state, setState} = useTmpState(false, 3000);

  const onDelete = () => {
    if (state) {
      deleteFn();
    }
    setState(true)
  }

  return <Button sx={{color: state ? "red" : "orangered"}}
                 endIcon={<DeleteIcon/>}
                 onClick={onDelete}>
    {state ? "Löschen bestätigen" : `${label} löschen`}
  </Button>
};
