import { Typography, Box, useTheme } from '@mui/material';

const Separator = () => {
  const theme = useTheme();

  return (
    <Box display="flex" flexDirection="row" alignItems="center" width="100%" my={3}>
      <Box width="30%" height="1px" bgcolor={theme.palette.grey[100]} />
      <Typography
        variant="body1"
        sx={{
          margin: theme.spacing(0, 1),
          width: '40%',
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: '400',
          color: theme.palette.grey[300],
        }}
      >
        or, use your email
      </Typography>
      <Box width="30%" height="1px" bgcolor={theme.palette.grey[100]} />
    </Box>
  );
};

export default Separator;
