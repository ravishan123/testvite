import { useParams } from 'react-router-dom';
import { useTheme } from '@ui/theme';
import { Grid, Box, BoxProps } from '@ui/layout';
import Image from '@ui/image';
import { Typography, TypographyProps } from '@ui/typography';
import { Skeleton } from '@ui/skeleton';

import ContentContainer from '@globals/contentContainer';
import RolesDropdown from '@ui/rolesDropdown';

import { useAppSelector } from '@store/hooks';
import { selectUserProfile, selectUserProfileResult } from '@store/slices/profile/profile.slice';

import { getProfileLogo, stringAvatar } from '@utils/functions/avatarUtils';

type AdminPanelProps = {
  id: string;
  supporter: string;
  role: string;
  handleRefetch: () => void;
  disable?: boolean;
};

const nameContainerProps: BoxProps = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  overflow: 'hidden',
  ml: 1,
  textAlign: 'left',
  flexGrow: 1,
};

const profileNameElemProps: TypographyProps = {
  variant: 'body1',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

const emailElemProps: TypographyProps = {
  variant: 'body1-secondary',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

export default function ManageAdminRoles({ id, supporter, role, handleRefetch, disable }: AdminPanelProps) {
  const { palette, fontSize } = useTheme();
  const { id: orgId } = useParams() as { id: string };
  const profile = useAppSelector(selectUserProfile);
  const { isLoading } = useAppSelector(selectUserProfileResult);

  return (
    <Grid container>
      <ContentContainer size={[1, 0, 0, 0]}>
        <Box>
          <Box display="flex" alignItems="center" overflow="hidden" width="100%">
            <Image
              width={28}
              height={28}
              backgroundColor={palette.common.white}
              backgroundColorOnError={palette.primary.main}
              sx={{ fontSize: fontSize.sm, border: `1px solid ${palette.grey['200']}` }}
              alt="profile"
              src={getProfileLogo(`${id}`) || ''}
            >
              {stringAvatar(supporter).text || ''}
            </Image>
            <Box {...nameContainerProps}>
              <Box display="inline-flex">
                <Typography {...profileNameElemProps}>
                  {isLoading ? <Skeleton variant="text" width="90%" /> : supporter}
                </Typography>
                {profile?.id === id && (
                  <Typography ml={0.5} variant="body1-secondary">
                    (You)
                  </Typography>
                )}
              </Box>
              <Typography sx={{ textTransform: 'capitalize' }} {...emailElemProps}>
                {isLoading ? <Skeleton variant="text" width="70%" /> : role?.toLowerCase() || ''}
              </Typography>
            </Box>
            <Box>
              <RolesDropdown
                handleRefetch={handleRefetch}
                showRole={false}
                orgId={orgId}
                role={role}
                userId={id}
                name={supporter}
                disable={disable}
              />
            </Box>
          </Box>
        </Box>
      </ContentContainer>
    </Grid>
  );
}
