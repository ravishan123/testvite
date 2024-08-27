import { useState } from 'react';

import { PageRoute } from '@utils/types/router.type';

import { Grid } from '@ui/layout';

import AppContainer from '@layouts/containers/appContainer';

import ContentContainer from '@globals/contentContainer';

import OrgCreation from './orgCreation';

import ConfirmDialog from '@globals/confirmDialog';

type OrgCreationPageProps = {
  routeInfo: PageRoute;
};

export default function OrgCreationPage({ routeInfo }: OrgCreationPageProps) {
  const [isFormDirty, setIsFormDirty] = useState(false);

  return (
    <AppContainer
      isVerifyBeforeLeave={isFormDirty}
      routeInfo={routeInfo}
      prompt={(onConfirm, onCancel) => (
        <ConfirmDialog
          open={isFormDirty}
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
        <Grid container rowSpacing={2}>
          <Grid item flexGrow={1}>
            <ContentContainer size="lg">
              <OrgCreation onChange={(isDirty) => setIsFormDirty(isDirty)} />
            </ContentContainer>
          </Grid>
        </Grid>
      }
      rightColumn={<div></div>}
    />
  );
}
