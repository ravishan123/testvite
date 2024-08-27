import { Skeleton } from '@ui/skeleton';
const skeletonData = [
  { fontSize: '3rem' },
  { fontSize: '2rem', width: '80%' },
  { fontSize: '2rem' },
  { fontSize: '2rem', width: '50%' },
  { fontSize: '3rem', width: '50%' },
  { fontSize: '2rem', width: '50%' },
  { fontSize: '1rem', width: '50%' },
  { fontSize: '1rem', width: '10%' },
  { fontSize: '2rem', width: '20%' },
  { fontSize: '3rem' },
  { fontSize: '2rem', width: '90%' },
  { fontSize: '1rem' },
  { fontSize: '3rem', width: '30%' },
];

const FormSkeleton = () => {
  return (
    <>
      {skeletonData.map((props, index) => (
        <Skeleton key={index} variant="text" sx={props} />
      ))}
    </>
  );
};

export { FormSkeleton };
