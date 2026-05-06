import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useAuthStore, useAuthActions } from '../state/auth-store';

export const UserNotification = () => {
  const permission = useAuthStore((s) => s.notificationPermission);
  const currentUser = useAuthStore((s) => s.currentUser);
  const { enableNotifications } = useAuthActions();

  if (!currentUser || permission === 'unsupported') return null;

  return (
    <Box sx={{ mt: 2 }}>
      {permission === 'denied' ? (
        <Typography variant="body2" color="text.secondary">
          Push-Benachrichtigungen: Berechtigung verweigert – bitte in den Browser-Einstellungen zurücksetzen.
        </Typography>
      ) : (
        <FormControlLabel
          control={
            <Checkbox
              checked={permission === 'granted'}
              onChange={permission === 'default' ? enableNotifications : undefined}
              disabled={permission === 'granted'}
            />
          }
          label="Push-Benachrichtigungen"
        />
      )}
    </Box>
  );
};
