import { useEffect, useRef, useState, type ReactNode } from "react";

type PageLayoutProps = {
    header?: ReactNode;
    children?: ReactNode;
    bottomArea?: ReactNode;
    contentClassName?: string;
};

export default function PageLayout({
    header,
    children,
    bottomArea,
    contentClassName = "",
}: PageLayoutProps) {
    // fixed 하단 영역의 실제 DOM을 잡기 위한 ref
    const bottomAreaRef = useRef<HTMLDivElement | null>(null);
    // 측정한 하단 영역 높이를 저장해서 .btn-group 높이에 반영
    const [bottomAreaHeight, setBottomAreaHeight] = useState(0);

    useEffect(() => {
        if (!bottomArea) {
            return;
        }

        const element = bottomAreaRef.current;

        if (!element) {
            return;
        }

        // 하단 영역 높이를 체크하고, 콜백에서 state를 갱신. fixed-bottom에 높이 추가
        const resizeObserver = new ResizeObserver(() => {
            setBottomAreaHeight(element.offsetHeight);
        });

        resizeObserver.observe(element);

        return () => {
            resizeObserver.disconnect();
        };
    }, [bottomArea]);

    const contentClassNameText = `p-6 ${header ? "" : "pt-12"} ${bottomArea ? "pb-2" : "pb-10"} ${contentClassName}`.trim();

    return (
        <div className="min-h-dvh" data-enter-scope="true">
            <div className="flex min-h-dvh w-full min-w-2xs flex-col">
                {header ? header : null}

                <main className="flex-1">
                    <div className={contentClassNameText}>
                        {children}
                    </div>
                </main>

                {bottomArea ? (
                    <div className="fixed-bottom" style={{ height: `${bottomAreaHeight}px` }}>
                        <div className="fixed bottom-0 left-0 right-0 z-10 bg-[#ffffff]">
                            <div
                                // 이 div를 ref로 잡아 실제 높이를 측정한다.
                                ref={bottomAreaRef}
                                className="mx-auto flex w-full min-w-2xs flex-col gap-1.5 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
                            >
                                {bottomArea}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
