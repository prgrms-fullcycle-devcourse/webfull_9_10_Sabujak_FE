export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
};

export function getCountdownParts(targetDate: string, now: number): CountdownParts {
  const targetTime = new Date(targetDate).getTime();
  const difference = Math.max(0, targetTime - now);
  const totalSeconds = Math.floor(difference / 1000);

  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    completed: difference === 0,
  };
}
