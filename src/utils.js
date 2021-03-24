import roundTo from "round-to";

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


export const fileSize = bytes => {
  if (bytes < 10 ** 3) return `${bytes}B`;
  if (bytes < 10 ** 6) return `${(bytes / 10 ** 3).toPrecision(3)}KB`;
  if (bytes < 10 ** 9) return `${(bytes / 10 ** 6).toPrecision(3)}MB`;
  if (bytes < 10 ** 12) return `${(bytes / 10 ** 9).toPrecision(3)}GB`;
  return `${roundTo(bytes / 10 ** 12, 2)}TB`;
}