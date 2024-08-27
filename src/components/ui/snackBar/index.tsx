import React, { createContext, useContext, useState, useCallback, ReactElement } from 'react';
import { Alert, Snackbar, SnackbarOrigin } from '@mui/material';
import { CheckCircleOutlineIcon } from '@ui/icons';

interface CustomSnackbarProps {
  open?: boolean;
  severity?: 'success' | 'info' | 'warning' | 'error';
  message?: string;
  children: ReactElement[] | ReactElement;
}

type Severity = 'success' | 'info' | 'warning' | 'error';

type OpenSnackbarFun = (message: string, Severity: Severity, position?: SnackbarOrigin) => void;

interface SnackbarContextType {
  openSnackbar: OpenSnackbarFun;
}

const SnackbarContext = createContext<SnackbarContextType | null>(null);

const SnackbarProvider: React.FC<CustomSnackbarProps> = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<Severity>('success');
  const [snackbarPosition, setSnackbarPosition] = useState<SnackbarOrigin>({ vertical: 'top', horizontal: 'center' });

  const openSnackbar = useCallback<OpenSnackbarFun>((message, severity, position) => {
    if (message) {
      setSnackbarSeverity(severity);
      setSnackbarMessage(message);
      setSnackbarPosition(position || { vertical: 'top', horizontal: 'center' });
      setSnackbarOpen(true);
    }
  }, []);

  return (
    <SnackbarContext.Provider value={{ openSnackbar }}>
      {children}
      <Snackbar
        anchorOrigin={snackbarPosition}
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={6000}
        sx={{ zIndex: 99 }}
      >
        <Alert
          iconMapping={{
            success: <CheckCircleOutlineIcon fontSize="inherit" />,
          }}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (context === null) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export { SnackbarProvider, useSnackbar };
