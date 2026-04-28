import { useNavigate, useParams } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { useListActions } from "../state/list-store";

export const SharedList = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { addShareList } = useListActions();

  const addSharedList = (add: boolean) => {
    if (params.id && add) {
      addShareList(params.id).then(() => {
        navigate(`/list/${params.id}`);
      });
    } else {
      navigate(`/list`);
    }
  };

  return (
    <div>
      <Card sx={{ margin: "10px" }}>
        <CardContent sx={{ textAlign: "start" }}>
          <Typography variant="h4">Shared List</Typography>
          <Typography variant="h5" component="div"></Typography>
          <Typography>
            Eine Liste wurde mit Ihnen geteilt. Sie können diese Einladung
            annehmen oder verwerfen
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            style={{ display: "flex", flexDirection: "column" }}
            onClick={() => addSharedList(true)}
          >
            <CheckIcon fontSize="medium" />
            Liste Hinzufügen
          </Button>
          <Button
            size="small"
            style={{ display: "flex", flexDirection: "column", color: "red" }}
            onClick={() => addSharedList(false)}
          >
            <ClearIcon fontSize="medium" />
            Einladung verwerfen
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};
