import { Box } from '@mui/material';
import { OnlyAnonymous, OnlyUser } from '../components/only-user';
import { UserAnonymous } from '../components/user-anonymous';
import { UserConnected } from '../components/user-connected';

export const User = () => {
  return (
    <Box sx={{ p: 2 }}>
      <OnlyAnonymous>
        <UserAnonymous />
      </OnlyAnonymous>
      <OnlyUser>
        <UserConnected />
      </OnlyUser>
    </Box>
  );
};
