import { Grid } from '@ui/layout';
import { Skeleton } from '@ui/skeleton';

const LoadingOrg = () => {
  return (
    <Grid container columnSpacing={3} rowSpacing={3} p={1} pb={4} pr={5} position="relative">
      <Grid display="flex" alignItems="flex-start" mt={{ sm: 0, md: 2.5 }} item>
        <Skeleton width={96} height={96} variant="rounded" />
      </Grid>
      <Grid></Grid>

      <Grid component="div" item xs={12} md>
        <Skeleton width="40%" height={48} />
        <Skeleton width="80%" height={28} />
        <Skeleton width="90%" height={28} />
        <Grid item component="div" display="flex" columnGap={1} rowGap={1} mt={2} flexWrap="wrap">
          <Skeleton width={100} height={58} />
          <Skeleton width={100} height={58} />
          <Skeleton width={100} height={58} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LoadingOrg;
