import type { ReactNode } from "react";
import HeartJar from "../../../features/capsule/components/HeartJar";
import PageLayout from "../layout/PageLayout";

interface LoadingProps {
  image?: ReactNode | string;
  text?: string;
}

const Loading = ({
  image = <HeartJar total={12} />,
  text = "로딩 중입니다.",
}: LoadingProps) => {
  return (
    <PageLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="flex min-h-48 items-center justify-center">
          {typeof image === "string" ? (
            <img src={image} alt="loading" className="h-48 w-48 object-contain" />
          ) : (
            image
          )}
        </div>
        <p className="mt-6 text-center text-xl font-bold">{text}</p>
      </div>
    </PageLayout>
  );
};

export default Loading;
