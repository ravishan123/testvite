function getDaysRemaining(date: string) {
  const currentDate = new Date();
  const targetDate = new Date(date);
  const timeDiff = targetDate.getTime() - currentDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
}

export { getDaysRemaining };
