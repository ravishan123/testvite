import { Alert, Snackbar, SnackbarOrigin } from '@mui/material';
import { CheckCircleOutlineIcon, ErrorOutlineIcon } from '@ui/icons';
import ReactDOM from 'react-dom/client';

interface CustomSnackbarProps extends SnackbarOrigin {
  open: boolean;
  severity: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface CreateMessageProps {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  duration?: number;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({ open, vertical, horizontal, message, severity }) => {
  if (!message?.length) return null;
  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={() => {
        /* do nothing */
      }}
      message={message}
      autoHideDuration={6000}
      sx={{ zIndex: 99, borderRadius: '4px', ...(severity === 'error' && { color: '#EF5D2F' }) }}
    >
      <Alert
        iconMapping={{
          success: <CheckCircleOutlineIcon fontSize="inherit" />,
          error: <ErrorOutlineIcon fontSize="inherit" sx={{ color: '#EF5D2F' }} />,
        }}
        severity={severity}
        sx={{
          width: '100%',
          fontFamily: 'Inter',
          ...(severity === 'error' && { color: '#EF5D2F', borderColor: '#EF5D2F', borderWidth: '1px' }),
          fontWeight: 400,
          padding: '8px 16px',
          border: '1px solid',
          borderRadius: '8px',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

let id = 0;

export const createMessagePopup = ({ type, message, duration = 3000 }: CreateMessageProps): void => {
  // create a new container
  const container = document.createElement('div');
  document.body.appendChild(container);

  // calculate id for the current message
  id += 1;
  const currentId = id;

  // render the message
  const root = ReactDOM.createRoot(container);
  root.render(<CustomSnackbar open={true} vertical="top" horizontal="center" message={message} severity={type} />);

  // after duration, remove the message
  setTimeout(() => {
    if (currentId === id) {
      root.unmount();
      document.body.removeChild(container);
    }
  }, duration);
};

export default CustomSnackbar;
