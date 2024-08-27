import React from 'react';
import Image from '@ui/image';
import { useTheme } from '@ui/theme';
import { Grid, Box } from '@ui/layout';
import { Typography } from '@ui/typography';
import { getProfileLogo, stringAvatar } from '@utils/functions/avatarUtils';
import { Skeleton } from '@ui/skeleton';
interface Supporter {
  id: string;
  supporter: string;
}

interface SupportersListProps {
  supporters: Supporter[];
  isLoading: boolean;
}

const SupportersList: React.FC<SupportersListProps> = ({ supporters, isLoading }) => {
  const { palette, fontSize } = useTheme();

  if (isLoading) {
    return (
      <Grid container spacing={2} sx={{ borderBottom: `1px solid ${palette.grey[100]}` }}>
        {Array.from({ length: 18 }).map((_, index) => (
          <Grid
            item
            key={index}
            xs={12}
            sm={6}
            pb={2}
            sx={{
              borderTop: index === 0 || index === 1 ? 'none' : `1px solid ${palette.grey[100]}`,
              borderBottom:
                index % 2 === 1 && index === supporters.length - 2 ? `1px solid ${palette.grey[100]}` : 'none',
              mb: index % 2 === 1 && index === supporters.length - 2 ? -0.1 : 0,
            }}
          >
            <Box display="flex" alignItems="center">
              <Skeleton animation="wave" variant="circular" width={36} height={36} sx={{ mr: 2 }} />
              <Skeleton animation="wave" variant="text" width={150} height={24} />
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={2} sx={{ borderBottom: `1px solid ${palette.grey[100]}` }}>
      {supporters.map((supporter, index) => (
        <Grid
          item
          key={supporter.id}
          xs={12}
          sm={6}
          pb={2}
          sx={{
            borderTop: index === 0 || index === 1 ? 'none' : `1px solid ${palette.grey[100]}`,
            borderBottom:
              index % 2 === 1 && index === supporters.length - 2 ? `1px solid ${palette.grey[100]}` : 'none',
            mb: index % 2 === 1 && index === supporters.length - 2 ? -0.1 : 0,
          }}
        >
          <Box display="flex" alignItems="center">
            <Image
              width={36}
              height={36}
              backgroundColor={palette.common.white}
              backgroundColorOnError={palette.primary.main}
              sx={{ fontSize: fontSize.sm, mr: 2 }}
              alt="profile"
              src={getProfileLogo(supporter.id)}
            >
              {stringAvatar(supporter.supporter).text}
            </Image>
            <Typography variant="h6" component="div">
              {supporter.supporter}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default SupportersList;
