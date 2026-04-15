import type { CountdownRenderProps } from "react-countdown";
import Countdown from "../../../../shared/components/ui/Countdown";
import { NumberRoller } from "@/shared/components/ui/NumberRoller";

type CapsuleCountdownProps = {
  targetDate: string;
};

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
      <p className="text-[4rem] font-bold leading-none">D-<NumberRoller value={days} height={60}/></p>
      <p className="mt-3 text-[2rem] font-bold leading-none">
        <NumberRoller value={hours} padStart={2} height={40}/>:<NumberRoller value={minutes} padStart={2} height={40}/>:<NumberRoller value={seconds} padStart={2} height={40}/>
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
