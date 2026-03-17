import type { ReactNode } from "react";

interface ModalLayoutProps {
  header?: ReactNode;
  children: ReactNode;
  bottomArea?: ReactNode;
  zIndex?: number;
}

export default function ModalLayout({
  header,
  children,
  bottomArea,
  zIndex = 9999,
}: ModalLayoutProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      style={{ zIndex }}
    >
      <div className="w-96 bg-white rounded-[32px] shadow-2xl flex flex-col justify-start items-start overflow-hidden">
        {/* 헤더 */}
        {header && (
          <div className="self-stretch px-6 py-5 border-b border-neutral-100 inline-flex justify-between items-center">
            {header}
          </div>
        )}

        {/* 본문 */}
        <div className="self-stretch">
          {children}
        </div>

        {/* 버튼 영역 */}
        {bottomArea && (
          <div className="self-stretch px-6 pt-2 pb-8 flex justify-end gap-2">
            {bottomArea}
          </div>
        )}
      </div>
    </div>
  );
}
