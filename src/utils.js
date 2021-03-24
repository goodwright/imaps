export const duration = seconds => {
  /**
   * Converts a number of seconds to a human readable string describing the
   * duration.
   */

  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    let time = `${mins}m`;
    const secs = seconds % 60;
    if (secs) time += `${secs}s`
    return time;
  }
  let time = "";
  const hours =  Math.floor(seconds / 3600);
  if (hours) time += `${hours}h`;
  const mins = Math.floor((seconds % 3600) / 60);
  if (mins) time += `${mins}m`;
  const secs = seconds % 60;
  if (secs) time += `${secs}s`
  return time;
}