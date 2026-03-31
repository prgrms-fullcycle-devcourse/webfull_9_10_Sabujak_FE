import type { CountdownRenderProps } from "react-countdown";
import Countdown from "../../../../shared/components/ui/Countdown";

type CapsuleCountdownProps = {
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

export default function CapsuleCountdown({ targetDate }: CapsuleCountdownProps) {
  return (
    <Countdown
      targetDate={targetDate}
      renderer={CountdownRenderer}
    />
  );
}
