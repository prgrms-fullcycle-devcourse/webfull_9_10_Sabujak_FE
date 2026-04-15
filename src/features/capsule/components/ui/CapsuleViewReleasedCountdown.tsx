import Countdown from "@/shared/components/ui/Countdown";
import { NumberRoller } from "@/shared/components/ui/NumberRoller";
import type { CountdownRenderProps } from "react-countdown";

type CapsuleViewReleasedCountdownProps = {
  targetDate: string | Date;
  height: number;
};

function CountdownRenderer({
  days,
  hours,
  minutes,
  seconds,
  completed,
  height
}: CountdownRenderProps & { height: number }) {
  if (completed) {
    return (
      <div className="text-[14px] leading-relaxed">
        이 타임캡슐은 0일 0시 0분 0초 후에 영구히 사라집니다.
      </div>
    );
  }

  return (
    <div className="text-[14px] leading-relaxed">
      이 타임캡슐은 <NumberRoller value={days} height={height}/>일 <NumberRoller value={hours} height={height}/>시 <NumberRoller value={minutes} height={height}/>분 <NumberRoller value={seconds} height={height}/>초 후에 영구히 사라집니다.
    </div>
  );
}

export default function CapsuleViewReleasedCountdown({ targetDate, height }: CapsuleViewReleasedCountdownProps) {
  return (
    <Countdown
      targetDate={targetDate}
      renderer={(props) => <CountdownRenderer {...props} height={height} />}
    />
  );
}