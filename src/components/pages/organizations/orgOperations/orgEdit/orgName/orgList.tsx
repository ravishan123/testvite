import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Link } from '@mui/material';
import { Typography } from '@ui/typography';
import { styled } from '@ui/theme';
import Image from '@ui/image';
import { HomeWorkOutlinedIcon } from '@ui/icons';
import { Org } from '@utils/types/organization.type';

const StyledLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  borderTop: `1px solid ${theme.palette.grey['100']}`,
  paddingTop: theme.spacing(1),
  justifyContent: 'center',
  fontSize: theme.fontSize.sm,
  marginBottom: theme.spacing(2),
  fontWeight: theme.fontWeight.semiBold,
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export function OrgList({
  orgList,
  showMore,
  toggleVisibleItems,
}: {
  orgList: Org[];
  showMore: boolean;
  toggleVisibleItems: () => void;
}) {
  if (!orgList?.length) {
    return null;
  }

  return (
    <>
      <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
          }}
          pl={2}
          pb={1}
        >
          Organizations with a similar name
        </Typography>
        {orgList.slice(0, showMore ? orgList.length : 2).map((org: Org, index) => (
          <ListItem key={`org-${org.name}-${index}`} sx={{ paddingLeft: 2 }}>
            <ListItemAvatar>
              <Image src={org.logo} isAvatar shape="rounded" alt={org.name} width={56} height={56}>
                <HomeWorkOutlinedIcon />
              </Image>
            </ListItemAvatar>
            <ListItemText
              sx={{ paddingLeft: 2 }}
              primary={<Typography variant="h4">{org.name}</Typography>}
              secondary={
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  {org.orgtype}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>

      {orgList.length > 2 && (
        <StyledLink underline="hover" onClick={toggleVisibleItems}>
          Show {showMore ? 'less' : 'more'}
        </StyledLink>
      )}
    </>
  );
}
