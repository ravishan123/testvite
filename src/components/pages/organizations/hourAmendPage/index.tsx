import { useState } from 'react';

import { PageRoute } from '@utils/types/router.type';

import { Grid } from '@ui/layout';

import ConfirmDialog from '@globals/confirmDialog';

import AppContainer from '@layouts/containers/appContainer';

import HourAmendForm from './hourAmendForm';

type HourRequestPageProps = {
  routeInfo: PageRoute;
};

export default function HourAmendPage({ routeInfo }: HourRequestPageProps) {
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
          <HourAmendForm onChange={(isDirty) => setIsFormDirty(isDirty)} />
        </Grid>
      }
      rightColumn={<></>}
    />
  );
}
