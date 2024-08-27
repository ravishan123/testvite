import { Grid } from '@ui/layout';
import { Typography } from '@ui/typography';

type SectionHeaderProps = {
  title: string;
};

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <Grid item xs={12} py={1} mt={1}>
      <Typography variant="h4">{title}</Typography>
    </Grid>
  );
}
