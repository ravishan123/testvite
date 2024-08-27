import { NavLink } from 'react-router-dom';

import { LayoutOutlet, PageRoute } from '@utils/types/router.type';

import { styled } from '@ui/theme';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@ui/list';
import { CircularProgress } from '@ui/circularProgress';
// TODO:  import NotificationBadge from './notificationBadge';

type AppLeftNavigationProps = {
  config: Record<string, PageRoute | LayoutOutlet>;
};

const StyledListItem = styled(ListItemButton)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.text.primary,
  marginBottom: 12,
  paddingLeft: theme.spacing(1),
  borderRadius: theme.borderRadius.md,

  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
  },
  '& .MuiTypography-root': {
    fontSize: theme.fontSize?.md,
    fontWeight: theme.fontWeight?.bold,
    color: 'inherit',
  },
  '&.Mui-selected': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  '& .MuiListItemIcon-root': {
    color: 'inherit',
    minWidth: 'auto',
    marginRight: 12,
  },
}));

// TODO
// const StyledNotificationBadge = styled(NotificationBadge)(({ theme }) => ({
//   marginLeft: theme.spacing(1),
//   '& .MuiBadge-badge': {
//     position: 'relative',
//     transform: 'translate(0, -1px)',
//   },
// }));

export default function AppLeftNavigation({ config }: AppLeftNavigationProps) {
  return (
    <List sx={{ mt: 0, ml: -1 }}>
      {Object.values(config as Record<string, PageRoute>).map(({ label, Icon, path, skipLeftNav }: PageRoute) => {
        const isDisabled = label === 'Notifications' || label === 'Settings & Support';
        return (
          !skipLeftNav &&
          (isDisabled ? (
            <StyledListItem
              key={path}
              sx={{
                //TODO: this line need to un commet after feature development
                // cursor: 'context-menu',
                opacity: 0.3,
                //remove after  feature implemetation
                cursor: 'default',
                mb: 4,
              }}
              selected={false}
              disableGutters
            >
              {/* 
              {Icon ? <ListItemIcon>{<Icon />}</ListItemIcon> : null}
               */}
              <ListItemText
                primary={
                  <>
                    {/* TODO:remove this ifter feature development */}
                    {/* {label} */}
                    {/* TODO: {label === 'Notifications' ? <StyledNotificationBadge /> : ''} */}
                  </>
                }
              />
            </StyledListItem>
          ) : (
            <NavLink
              key={path}
              to={path || ''}
              onClick={() => {
                localStorage.setItem('navigated_from', window.location.pathname || '');
              }}
              style={{
                textDecoration: 'none',
              }}
            >
              {({ isActive, isPending }) => (
                <StyledListItem
                  sx={{
                    cursor: 'pointer',
                  }}
                  selected={isActive}
                  disableGutters
                >
                  {isPending && (
                    <ListItemIcon>
                      <CircularProgress size={16} />
                    </ListItemIcon>
                  )}
                  {Icon && !isPending ? <ListItemIcon>{<Icon />}</ListItemIcon> : null}
                  <ListItemText
                    primary={
                      <>
                        {label}
                        {/* TODO: {label === 'Notifications' ? <StyledNotificationBadge /> : ''} */}
                      </>
                    }
                  />
                </StyledListItem>
              )}
            </NavLink>
          ))
        );
      })}
    </List>
  );
}
