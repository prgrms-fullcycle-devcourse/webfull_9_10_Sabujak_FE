import { useEffect, useState, type ReactNode } from "react";
import HeartJar from "./HeartJar";
import { useDimStore } from "../../store/useDimStore";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

interface LoadingProps {
  image?: ReactNode | string;
  text?: string;
}

const Loading = ({
  image = <HeartJar total={12} />,
  text = "로딩중 입니다.",
}: LoadingProps) => {
  const zIndex = useDimStore((state) => state.zIndex + 1);
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isLoading = isFetching > 0 || isMutating > 0;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isLoading);
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center backdrop-blur-sm"
      style={{ zIndex }}
    >
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
