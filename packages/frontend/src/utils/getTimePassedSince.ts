export function getTimePassedSince(timestamp: string): string {
  const postedAt = new Date(timestamp);
  const now = new Date();
  const differenceMs = now.getTime() - postedAt.getTime();
  const differenceSec = Math.floor(differenceMs / 1000);

  if (differenceSec < 60) {
    return `${differenceSec} ${differenceSec === 1 ? 'second' : 'seconds'} ago`;
  } else if (differenceSec < 3600) {
    const minutes = Math.floor(differenceSec / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (differenceSec < 86400) {
    const hours = Math.floor(differenceSec / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (differenceSec < 2592000) {
    const days = Math.floor(differenceSec / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    const months = Math.floor(differenceSec / 2592000);
    return `${months} ${months === 1 ? 'month' : 'days'} ago`;
  }
}
