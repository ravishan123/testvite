import { useState } from 'react';

import { PageRoute } from '@utils/types/router.type';

import { Grid } from '@ui/layout';
import { List, ListItem, ListItemIcon, ListItemText } from '@ui/list';
import { CheckCircleOutlineIcon } from '@ui/icons';

import ConfirmDialog from '@globals/confirmDialog';
import ActionBanner from '@globals/actionBanner';

import AppContainer from '@layouts/containers/appContainer';

import AddHoursForm from './addHoursForm';

type HourRequestPageProps = {
  routeInfo: PageRoute;
};

export default function HourRequestPage({ routeInfo }: HourRequestPageProps) {
  const [isFormDirty, setIsFormDirty] = useState(false);

  return (
    <AppContainer
      isVerifyBeforeLeave={isFormDirty}
      routeInfo={routeInfo}
      prompt={(onConfirm, onCancel) => (
        <ConfirmDialog
          open
          width={435}
          title="Are you sure you want to go back?"
          onClose={onCancel}
          description={
            <>
              <span style={{ padding: '0 16px 0 16px', display: 'inline-block' }}>
                By completing this action you will loose the details you've added.
              </span>
              <span style={{ paddingTop: 16, display: 'inline-block' }}>Would you like to continue?</span>
            </>
          }
          isReverseFooterButtons
          confirmButton={{
            text: 'Continue',
            color: 'error',
            variant: 'contained-secondary',
            onClick: onConfirm,
          }}
          cancelButton={{
            text: 'Cancel',
            variant: 'contained-secondary',
            onClick: onCancel,
          }}
        />
      )}
      contentColumn={
        <Grid container>
          <AddHoursForm onChange={(isDirty) => setIsFormDirty(isDirty)} />
        </Grid>
      }
      rightColumn={
        <Grid item xs>
          <ActionBanner
            direction="vertical"
            verticalSize={[36 / 8, 5, 2, 5]}
            image="/images/add_hours_action_banner.svg"
            imageWidth={113}
            imageHeight={106}
            title="Getting your volunteer hours verified will help you..."
            titleVariant="h4"
            description={
              <>
                <List sx={{ mt: 2 }} disablePadding>
                  {[
                    'stand out for scholarships, university, and job applications',
                    'contribute towards school service-learning or employee volunteering programs',
                    'to support charities, schools, businesses, and other organizations you value to showcase their volunteer impact',
                  ].map((item, index) => (
                    <ListItem key={`add-hours-banner-${index}`} disableGutters>
                      <ListItemIcon sx={{ minWidth: 36, color: 'success.main' }}>
                        <CheckCircleOutlineIcon />
                      </ListItemIcon>
                      <ListItemText>{item}</ListItemText>
                    </ListItem>
                  ))}
                </List>
              </>
            }
          />
        </Grid>
      }
    />
  );
}
