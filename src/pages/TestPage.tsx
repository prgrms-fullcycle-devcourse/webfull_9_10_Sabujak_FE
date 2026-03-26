import { Modal, Button } from "../shared/components/ui";
import { WriteMessageContent } from "./ModalWriteMessage";
import { AdminCheck } from "./AdminCheckPage";
import { AdminPage } from "./AdminPage";
import { useModalStore } from "../shared/store/useModalStore";
import Loading from "../shared/components/ui/Loading";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServerRequest } from "../shared/hooks/useServerRequest";

export default function TestPage() {
  const { openModal } = useModalStore();
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  // 1. 커스텀 훅 초기화
  const { isLoading, sendRequest } = useServerRequest({
    url: "https://api.example.com/data",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{ id : 1}", // 기본 body 구조 (추후 inputValue가 합쳐짐)
  });

  // 2. 버튼 클릭 핸들러
  const handleButtonClick = async () => {
    const result = await sendRequest(inputValue);

    if (result?.success) {
      // 성공 시 입력값 초기화 후 이동
      setInputValue("");
      void navigate("/success");
    } else if (result) {
      // 실패 시 모달 표시 (message가 객체일 수 있으므로 JSON.stringify 활용 가능)
      openModal({
        title: "오류 발생",
        content: (
          <div>
            {typeof result.message === "object" ? (
              <pre className="text-xs bg-gray-100 p-2 mt-2">
                {JSON.stringify(result.message, null, 2)}
              </pre>
            ) : (
              <p>{result.message}</p>
            )}
          </div>
        ),
        option: "oneButton",
      });
    }
  };

  if (isLoading) {
    return <Loading image="" />;
  }

  return (
    <>
      <div className="flex gap-8 p-4">
        {/* 버튼 1: 메세지 입력 모달 */}
        <Button
          onClick={() =>
            openModal({
              title: "편지 쓰기",
              content: <WriteMessageContent />,
              option: "writeMessage",
            })
          }
        >
          writeMessage
        </Button>

        <Button
          onClick={() =>
            openModal({
              title: "버튼1개",
              content: <p>내용</p>,
              option: "oneButton",
            })
          }
        >
          oneButton
        </Button>

        <Button
          onClick={() =>
            openModal({
              title: "버튼2개",
              content: <p>내용</p>,
              option: "twoButton",
            })
          }
        >
          twoButton
        </Button>

        <Button
          onClick={() =>
            openModal({
              title: "어드민 체크",
              content: <AdminCheck />,
              option: "adminCheck",
            })
          }
        >
          adminCheck
        </Button>

        <Button
          onClick={() =>
            openModal({
              title: "어드민",
              content: (
                <AdminPage
                  getRoomName="우리의 소중한 기록"
                  getOpenDate={new Date()}
                />
              ),
              option: "admin",
            })
          }
        >
          admin
        </Button>

        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="입력해줘"
        />

        <Button
          onClick={() => {
            void handleButtonClick();
          }}
        >
          Loading
        </Button>
      </div>
      <Modal />
    </>
  );
}
