import type { CSSProperties } from "react";

const floatingCircles = [
  { left: "5%", size: "28px", color: "pink", duration: "12s", delay: "-1.8s", shape: "circle", opacity: "0.34" },
  { left: "12%", size: "56px", color: "blue", duration: "18s", delay: "0.4s", shape: "circle", opacity: "0.4" },
  { left: "19%", size: "34px", color: "yellow", duration: "13s", delay: "1.2s", shape: "heart", opacity: "0.28" },
  { left: "28%", size: "60px", color: "pink", duration: "23s", delay: "2.4s", shape: "circle", opacity: "0.38" },
  { left: "38%", size: "30px", color: "green", duration: "11s", delay: "-0.8s", shape: "circle", opacity: "0.24" },
  { left: "47%", size: "44px", color: "blue", duration: "20s", delay: "3.3s", shape: "heart", opacity: "0.32" },
  { left: "58%", size: "48px", color: "yellow", duration: "15s", delay: "0.9s", shape: "circle", opacity: "0.3" },
  { left: "68%", size: "58px", color: "pink", duration: "25s", delay: "4.2s", shape: "circle", opacity: "0.36" },
  { left: "78%", size: "32px", color: "green", duration: "12.5s", delay: "1.8s", shape: "heart", opacity: "0.26" },
  { left: "87%", size: "52px", color: "blue", duration: "21s", delay: "2.9s", shape: "circle", opacity: "0.38" },
  { left: "94%", size: "24px", color: "yellow", duration: "10.5s", delay: "-0.2s", shape: "circle", opacity: "0.22" },
] as const;

export default function MainPageBackground() {
  return (
    <div className="main-page-bg" aria-hidden="true">
      {floatingCircles.map((circle, index) => {
        const circleStyle = {
          left: circle.left,
          width: circle.size,
          height: circle.size,
          animationDuration: circle.duration,
          animationDelay: circle.delay,
          "--float-opacity": circle.opacity,
        } as CSSProperties;

        return (
          <span
            key={`${circle.left}-${circle.size}-${index}`}
            className={`main-page-bg-circle main-page-bg-circle-${circle.color} ${
              circle.shape === "heart" ? "main-page-bg-heart" : ""
            }`}
            style={circleStyle}
          />
        );
      })}
    </div>
  );
}
