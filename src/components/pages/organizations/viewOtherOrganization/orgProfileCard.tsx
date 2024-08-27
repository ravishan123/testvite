import { useState } from 'react';
import { UserRoles } from '@utils/enums/roles.enum';
import format from 'date-fns/format';
import truncate from 'lodash-es/truncate';
import { OrganizationWithStats } from '@utils/types/organization.type';
import { Box, Grid } from '@ui/layout';
import { Link, Typography } from '@ui/typography';
import Image from '@ui/image';
import { Button, IconButton } from '@ui/button';
import { styled, useTheme } from '@ui/theme';
import { List, ListItemIcon, ListItemText, ListItem } from '@ui/list';
import {
  LocalPhoneOutlinedIcon,
  InsertLinkOutlinedIcon,
  CompostIcon,
  ChevronRightIcon,
  HomeWorkOutlinedIcon,
  AddIcon,
  ModeEditOutlineOutlinedIcon,
  ArrowRightIcon,
} from '@ui/icons';
import { Skeleton } from '@ui/skeleton';
import TextClipper from '@globals/textClipper';
import { Avatar } from '@ui/avatar';
import JoinGroupModal from './JoinGroupModal';
import EditGroupModal from './editGroupModal';
import { useNavigate } from 'react-router-dom';
import { getRoute } from '@utils/configs/routesConfig';

type OrgProfileCardProps = {
  organization?: Partial<OrganizationWithStats>;
  isLoading?: boolean;
  isCompact?: boolean;
  onViewMore?: () => void;
};

const Divider = styled('span')(({ theme }) => ({
  width: 2,
  height: 2,
  backgroundColor: theme.palette.grey['200'],
  display: 'inline-block',
  margin: theme.spacing(0, 1),
}));

const StyledIconButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  right: 3,
}));

export default function OrgProfileCard({
  organization = {},
  isCompact = true,
  isLoading = false,
  onViewMore,
}: OrgProfileCardProps) {
  const theme = useTheme();
  const {
    logo = '',
    name = '',
    about_us = '',
    city = '',
    country = '',
    created_at = '',
    phone_number = '',
    social_enterprise = '',
    website = '',
    social_link = '',
    orgtype = '',
    custom_orgtype = '',
    stats = {
      // eslint-disable-next-line @cspell/spellchecker
      numofrequestsverified: 0,
      supporters: 0,
      // eslint-disable-next-line @cspell/spellchecker
      approvedhours: {
        hours: 0,
        minutes: 0,
      },
    },
  } = organization;

  const [isJoinGroup, setIsJoinGroup] = useState(false);
  const closeJoinGroupModal = () => setIsJoinGroup(false);
  const [isEditGroup, setIsEditGroup] = useState(false);
  const closeEditGroupModal = () => setIsEditGroup(false);
  const isSupporter = !isLoading && organization.user_info && organization.user_info.role === UserRoles.SUPPORTER;

  const navigate = useNavigate();
  return (
    <>
      <Grid
        container
        columnSpacing={3}
        rowSpacing={3}
        p={1}
        pb={4}
        pr={5}
        position="relative"
        borderBottom={!isCompact ? `1px solid ${theme.palette.grey[100]} ` : 'none'}
      >
        <Grid display="flex" alignItems={'flex-start'} mt={{ sm: 0, md: isCompact ? 2.5 : 0 }} item>
          {isLoading ? (
            <Skeleton width={96} height={96} variant="rounded" />
          ) : (
            (logo && (
              <Image
                src={logo}
                width={96}
                height={96}
                shape="rounded"
                borderRadius="16px"
                alt="organization logo"
                hasBorder
              />
            )) || (
              <Avatar variant="rounded" sx={{ width: '88px', height: '88px', bgcolor: theme.palette.grey[100] }}>
                <HomeWorkOutlinedIcon fontSize="large" sx={{ color: theme.palette.grey[200] }} />
              </Avatar>
            )
          )}
        </Grid>
        <Grid item xs={12} md>
          <Box sx={{ maxWidth: { sm: '680px', md: isCompact ? '400px' : '580px' } }}>
            {isLoading ? (
              <>
                <Skeleton width="40%" height={48} />
                <Skeleton width="80%" height={28} />
                <Skeleton width="90%" height={28} />
                <Skeleton width="60%" height={28} />
              </>
            ) : (
              <>
                <Typography
                  variant="h2"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '400px',
                  }}
                >
                  {name}
                </Typography>
                <TextClipper text={about_us} />
              </>
            )}
          </Box>
          {!isCompact && (
            <Box mt={1}>
              <Typography variant="helper-text" sx={{ textTransform: 'capitalize' }}>
                {orgtype === 'other' ? custom_orgtype : orgtype}
              </Typography>
            </Box>
          )}
          {!isCompact && (
            <>
              <Box mb={12 / 8} mt={12 / 8}>
                {isLoading ? (
                  <>
                    <Skeleton width="40%" height={24} />
                    <Skeleton width="40%" height={24} />
                    <Skeleton width="40%" height={24} />
                  </>
                ) : (
                  <List sx={{ color: theme.palette.grey['300'] }} dense disablePadding>
                    {phone_number && (
                      <ListItem disableGutters disablePadding>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <LocalPhoneOutlinedIcon sx={{ width: 16 }} />
                        </ListItemIcon>
                        <ListItemText disableTypography sx={{ m: 0 }}>
                          <Typography variant="body4">{phone_number}</Typography>
                        </ListItemText>
                      </ListItem>
                    )}
                    {social_enterprise && (
                      <ListItem disableGutters disablePadding>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <CompostIcon sx={{ width: 16 }} />
                        </ListItemIcon>
                        <ListItemText disableTypography sx={{ m: 0 }}>
                          <Typography variant="body4">We are a social enterprise</Typography>
                        </ListItemText>
                      </ListItem>
                    )}
                    {(website || social_link) && (
                      <ListItem disableGutters disablePadding>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <InsertLinkOutlinedIcon sx={{ width: 16 }} />
                        </ListItemIcon>
                        <ListItemText disableTypography sx={{ m: 0 }}>
                          <Typography variant="body4">
                            <Box display="flex" columnGap={1}>
                              <Link target="_blank" href={website} underline="hover">
                                {truncate(website, {
                                  length: 30,
                                })}
                              </Link>
                              <Link target="_blank" href={social_link} underline="hover">
                                {truncate(social_link, {
                                  length: 30,
                                })}
                              </Link>
                            </Box>
                          </Typography>
                        </ListItemText>
                      </ListItem>
                    )}
                  </List>
                )}
              </Box>
              <Box>
                <Grid alignItems="center" display="flex" mt={1}>
                  {city && country && (
                    <Typography variant="helper-text">
                      {city}, {country}
                    </Typography>
                  )}
                  {city && country && created_at && <Divider />}
                  {created_at && (
                    <Typography variant="helper-text">Joined {format(new Date(created_at), 'LLL y')}</Typography>
                  )}
                </Grid>
              </Box>
            </>
          )}
          <Box display="flex" columnGap={1} rowGap={1} mt={2} flexWrap="wrap">
            {isSupporter ? (
              <Button
                variant="contained-secondary"
                size="medium-compact"
                startIcon={<ModeEditOutlineOutlinedIcon />}
                onClick={() => {
                  setIsEditGroup(true);
                }}
              >
                Edit groups
              </Button>
            ) : !isLoading ? (
              <>
                <Button size="medium-compact" onClick={() => setIsJoinGroup(true)} startIcon={<AddIcon />}>
                  Join group
                </Button>
              </>
            ) : (
              <Skeleton width={100} height={58} />
            )}
          </Box>
        </Grid>
        {!isLoading && isCompact && (
          <StyledIconButton onClick={onViewMore}>
            <ChevronRightIcon />
          </StyledIconButton>
        )}
      </Grid>
      {!isCompact && (
        <Grid container pt={3}>
          <Grid item xs textAlign="center">
            {/* eslint-disable-next-line @cspell/spellchecker */}
            <Typography variant="h4"> {stats.approvedhours.hours || 0}</Typography>
            <Typography variant="body1" color="text.secondary">
              Volunteer hours
            </Typography>
          </Grid>
          <Grid
            item
            xs
            textAlign="center"
            borderLeft={`1px solid ${theme.palette.grey[100]}`}
            borderRight={`1px solid ${theme.palette.grey[100]}`}
          >
            <Typography variant="h4">
              {/* eslint-disable-next-line @cspell/spellchecker */}
              {stats.numofrequestsverified}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Verified requests
            </Typography>
          </Grid>
          <Grid item xs textAlign="center">
            <Typography variant="h5">{stats.supporters}</Typography>
            <Typography
              variant="body1"
              onClick={() =>
                organization.id &&
                navigate(getRoute('private.app.organizations.profile.supporters', { id: organization.id }))
              }
              sx={{
                color: theme.palette.primary.main,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                ml: 2,
              }}
            >
              Supporters <ArrowRightIcon />
            </Typography>
          </Grid>
        </Grid>
      )}
      <JoinGroupModal
        organizationId={organization?.id || ''}
        isOpen={isJoinGroup}
        onClose={closeJoinGroupModal}
        logo={logo}
        orgName={organization.name || ''}
        orgType={orgtype === 'other' ? custom_orgtype : orgtype || null}
      />
      <EditGroupModal
        organizationId={organization?.id || ''}
        isOpen={isEditGroup}
        onClose={closeEditGroupModal}
        logo={logo}
        orgName={organization.name || ''}
        userInfo={organization.user_info || null}
        orgType={orgtype === 'other' ? custom_orgtype : orgtype || null}
      />
    </>
  );
}
