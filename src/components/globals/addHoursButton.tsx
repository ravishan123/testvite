import { Button, ButtonProps } from '@ui/button';
import { AddCircleIcon } from '@ui/icons';
import { getRoute } from '@utils/configs/routesConfig';
import { useNavigate } from 'react-router-dom';

export default function AddHoursButton({ sx, ...props }: ButtonProps) {
  const navigate = useNavigate();

  return (
    <Button
      sx={{ maxWidth: 221, width: '100%', ...sx }}
      {...props}
      onClick={() => navigate(getRoute('private.app.addHours'))}
      startIcon={<AddCircleIcon sx={{ height: 24, width: 24 }} />}
    >
      Add hours
    </Button>
  );
}
