import PageLayout from "../../../shared/components/layout/PageLayout";

interface UnavailableViewProps {
  title?: string;
}

export default function UnavailableView({
  title = "캡슐을 불러올 수 없습니다.",
}: UnavailableViewProps) {
  return (
    <PageLayout contentClassName="flex min-h-[70dvh] items-center justify-center text-center">
      <div>
        <p className="text-2xl font-bold">{title}</p>
        <p className="mt-3 text-sm text-[#8a8a8a]">
          슬러그를 다시 확인하거나 잠시 후 다시 시도해주세요.
        </p>
      </div>
    </PageLayout>
  );
}
