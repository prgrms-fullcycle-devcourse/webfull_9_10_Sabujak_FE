import { Button } from '../shared/components/ui';
import { WriteMessageContent } from '../features/message/components/ui/WriteMessageModal';
import { CapsuleEditCheckModal } from '../features/capsule/components/ui/CapsuleEditCheckModal';
import { CapsuleEditModal } from '../features/capsule/components/ui/CapsuleEditModal';
import { useModalStore } from '../shared/store/useModalStore';
import Loading from "../shared/components/ui/Loading";
import { useState } from "react";
import Modal from '../shared/components/ui/Modal';

export default function TestPage() {
  const { openModal } = useModalStore();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // 2. 버튼 클릭 핸들러

  return (
    <>
      <div className="flex gap-8 p-4">
        {/* 버튼 1: 메세지 입력 모달 */}
        <Button
          onClick={() => openModal({
            title: '편지 쓰기',
            content: <WriteMessageContent slug='testslug1111' />,
            option: 'writeMessage'
          })}
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

        <Button onClick={() => openModal({
          title: '어드민 체크',
          content: <CapsuleEditCheckModal slug='testslug1111' />,
          option: 'capsuleEditCheckModal'
        })}>
          capsuleEditCheckModal
        </Button>

        <Button onClick={() => openModal({
          title: '어드민',
          content: <CapsuleEditModal slug='testslug1111' password='1112' getRoomName="우리의 소중한 기록" getOpenDate={new Date()} />,
          option: 'capsuleEditModal'
        })}>
          CapsuleEditModal
        </Button>

        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="입력해줘"
        />

        <Button
          onClick={() => setIsLoading(!isLoading)}>
          Loading
        </Button>
        {isLoading && <Loading />}
      </div>
      <Modal />
    </>
  );
}
