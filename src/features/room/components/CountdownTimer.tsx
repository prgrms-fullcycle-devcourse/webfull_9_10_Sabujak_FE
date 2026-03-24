import Countdown, { type CountdownRenderProps } from "react-countdown";

type CountdownTimerProps = {
  targetDate: string;
};

function padTime(value: number) {
  return String(value).padStart(2, "0");
}

function CountdownRenderer({ days, hours, minutes, seconds, completed }: CountdownRenderProps) {
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

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  return (
    <Countdown
      date={new Date(targetDate)}
      renderer={CountdownRenderer}
    />
  );
}
