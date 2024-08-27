import React from 'react';
import ContentContainer from '@globals/contentContainer';
import { WorkspacePremiumIcon } from '@ui/icons';
import { Grid } from '@ui/layout';
import { useTheme } from '@ui/theme';
import { Typography } from '@ui/typography';

interface FeatureItemProps {
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ title, description }) => {
  const { palette } = useTheme();
  return (
    <Grid pt={2} pb={2} borderTop={`1px solid ${palette.grey[100]}`}>
      <Typography variant="h5">{title}</Typography>
      <Typography variant="body1-secondary" mt={0.5} width="90%">
        {description}
      </Typography>
    </Grid>
  );
};

const featureItems: FeatureItemProps[] = [
  {
    title: 'Owner',
    description:
      'Verify hours, manage supporter memberships, edit org. profile, assign or remove owner, supervisor and coordinator roles, view insights (coming soon)',
  },
  {
    title: 'Supervisor',
    description:
      'Verify hours, manage supporter memberships, edit org. profile, assign or remove owner, supervisor and coordinator roles, view insights (coming soon)',
  },
  {
    title: 'Coordinator',
    description: 'Verify hours, manage supporter memberships',
  },
];

const PremiumFeaturesContainer: React.FC = () => {
  const { palette } = useTheme();

  return (
    <ContentContainer borderTopColor={palette.warning.main} size={[0, 0, 2, 2]}>
      <Grid item xs={12} py={1} mt={1} display="inline-flex" alignItems="center">
        <Typography variant="h4">Premium Beta</Typography>{' '}
        <WorkspacePremiumIcon sx={{ fontSize: '24px', ml: 0.5, color: palette.warning.main }} />
      </Grid>
      <Grid mb={2}>
        <Typography variant="body1">Try premium features for free</Typography>
        <Typography variant="body1-secondary" mt={0.5} width="80%">
          Unlimited administrators, three types of administrator roles, view powerful insights
        </Typography>
      </Grid>

      {featureItems.map((item, index) => (
        <FeatureItem key={index} title={item.title} description={item.description} />
      ))}
    </ContentContainer>
  );
};

export default PremiumFeaturesContainer;
