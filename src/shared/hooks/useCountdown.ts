import { useEffect, useState } from "react";
import { getCountdownParts } from "../utils/countdown";

type UseCountdownParams = {
  targetDate: string;
};

export function useCountdown({ targetDate }: UseCountdownParams) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  return getCountdownParts(targetDate, now);
}

export default useCountdown;
