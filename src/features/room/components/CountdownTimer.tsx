import { useCountdown } from "../../../shared/hooks/useCountdown";

type CountdownTimerProps = {
  targetDate: string;
};

function padTime(value: number) {
  return String(value).padStart(2, "0");
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const {
    days,
    hours,
    minutes,
    seconds,
    completed,
  } = useCountdown({ targetDate });

  if (completed) {
    return (
      <div>
        <p className="text-[4rem] font-bold leading-none">D-0</p>
        <p className="mt-3 text-[2rem] font-bold leading-none">00:00:00</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[4rem] font-bold leading-none">D-{days}</p>
      <p className="mt-3 text-[2rem] font-bold leading-none">
        {padTime(hours)}:{padTime(minutes)}:{padTime(seconds)}
      </p>
    </div>
  );
}
