import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';

type ErrorPageProps = {
    title?: string;
    description?: string;
    messages?: { // 길이 4 고정
        id: number;
        content: string;
        color: string;
    }[];
    primaryButton?: {
        label: string;
        onClick: () => void;
    }
    secondaryButton?: {
        label: string;
        onClick: () => void;
    }
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
    title = "404 NOT FOUND",
    description = "앗! 길을 잃은 타임캡슐이에요",
    messages = [
        { id: 1, content: "주소가\n잘못되었을까요?", color: "bg-[#FFF9E5]" }, 
        { id: 2, content: "종이비행기가\n멀리 날아갔나 봐요.", color: "bg-[#FFE9F3]" },
        { id: 3, content: "이 페이지는\n비어있어요.", color: "bg-[#F0F4FF]" },
        { id: 4, content: "메인에서 다시\n시작해볼까요?", color: "bg-[#F2F8EE]" },
    ],
    primaryButton,
    secondaryButton
}) => {
  const navigate = useNavigate();
  primaryButton = primaryButton ?? {
    label: "메인 페이지로 돌아가기",
    onClick: () => void navigate('/')
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 font-sans text-[#333]">

      {/* 1. 상단 타이틀 및 정책 안내 */}
      <header className="w-full max-w-md mt-12 text-center">
        <h1 className="text-[50px] font-bold text-gray-800 tracking-tight">
          {title}
        </h1>
        <p className="mt-3 text-[20px] font-medium text-[#A39181] bg-[#F3EFE9] inline-block px-4 py-1.5 rounded-full">
          {description}
        </p>
      </header>

      {/* 2. Soft-Flat 파스텔 메시지 카드 */}
      <main className="w-full max-w-md grid grid-cols-2 gap-4 my-8">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${msg.color} aspect-square rounded-3xl p-6 flex items-center justify-center text-center transition-transform active:scale-95`}
          >
            <p className="whitespace-pre-line leading-relaxed font-semibold text-gray-700 break-keep">
              {msg.content}
            </p>
          </div>
        ))}
      </main>

      {/* 3. 하단 액션 버튼 (공유 대신 복구/이동 액션) */}
      <footer className="w-full max-w-md mb-8 flex flex-col gap-3">
        <Button
          onClick={primaryButton.onClick}
        >{primaryButton.label}</Button>

        {/* 보조 액션: 이전으로 */}
        {secondaryButton && (
            <button
            onClick={secondaryButton.onClick}
            className="w-full bg-transparent text-gray-400 py-2 text-[14px] font-medium hover:text-gray-600 transition-colors"
            >
                {secondaryButton.label}
            </button>
        )}
      </footer>

      {/* 배경 데코레이션 */}
      <div className="fixed top-[-5%] right-[-10%] w-32 h-32 bg-[#FFE9F3] rounded-full blur-3xl opacity-40 z-[-1]" />
      <div className="fixed bottom-[10%] left-[-5%] w-48 h-48 bg-[#FFF9E5] rounded-full blur-3xl opacity-50 z-[-1]" />
    </div>
  );
};
