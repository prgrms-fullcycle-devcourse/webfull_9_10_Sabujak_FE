import type { ReactNode } from "react";
import HeartJar from "./HeartJar";

interface LoadingProps {
  image?: ReactNode | string;
  text?: string;
}

const Loading = ({
  image = <HeartJar total={12} />,
  text = "로딩 중입니다.",
}: LoadingProps) => {
  return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="flex min-h-48 items-center justify-center">
          {typeof image === "string" ? (
            <img src={image} alt="loading" className="h-48 w-48 object-contain" />
          ) : (
            image
          )}
        </div>
        <p className="mt-6 text-center text-xl font-bold text-white">{text}</p>
      </div>
  );
};

export default Loading;
