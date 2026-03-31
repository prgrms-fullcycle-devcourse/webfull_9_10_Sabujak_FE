import ReactCountdown, { type CountdownRenderProps } from "react-countdown";

type CountdownProps = {
  targetDate: string | Date;
  renderer: (props: CountdownRenderProps) => React.ReactNode;
};

export default function Countdown({ targetDate, renderer }: CountdownProps) {
  return (
    <ReactCountdown
      date={new Date(targetDate)}
      renderer={renderer}
    />
  );
}
