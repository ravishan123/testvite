export const formatSupporters = (count: number): string => {
  if (count > 999) {
    const formattedCount = (count / 1000).toFixed(1);
    return formattedCount.endsWith('.0') ? `${parseInt(formattedCount)}K` : `${formattedCount}K`;
  } else {
    return count.toString();
  }
};
