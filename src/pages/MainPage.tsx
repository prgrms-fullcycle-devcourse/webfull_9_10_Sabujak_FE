import { useNavigate } from "react-router-dom";
import PageLayout from "../shared/components/layout/PageLayout";
import { Button, Field, Input } from "../shared/components/ui";
import { useState } from "react";

export default function MainPage() {
    const navigate = useNavigate();
    const [capsuleInfo, setCapsuleInfo] = useState("");

    return (
        <PageLayout
            bottomArea={
                <>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="text-sm text-gray-500">또는</span>
                        <div className="flex-1 h-px bg-gray-300" />
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => void navigate('/create-room')}
                        className="mt-6"
                    >
                        우리들만의 방 만들기
                    </Button>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        로그인 없이 1분 만에 시작하기
                    </p>
                </>
            }
        >
            <h3 className="mt-5 text-2xl text-center font-bold">사부작</h3>
            <h1 className="mt-11 text-4xl text-center font-bold">
                시간이 흐른 뒤 열어보는
                <br/>우리들의 진심
            </h1>
            <p className="mt-21 text-xl text-center font-bold">
                이미 참여중인 방이 있나요?
            </p>
            <p className="mt-2 text-base text-center text-gray-600">
                전달받은 방코드 또는 주소를
                <br/>입력해 주세요
            </p>
            
            <div className="mt-10 space-y-4">
                <Field id="roomTitle">
                    <Input
                        placeholder="방 코드 또는 링크 입력"
                        value={capsuleInfo}
                        onChange={(e) => setCapsuleInfo(e.target.value)}
                    />
                </Field>
                <Button
                    variant="secondary"
                    onClick={() => {
                        const isUrl = /^https?:\/\/.+/.test(capsuleInfo);
                        if (isUrl) {
                            void navigate(capsuleInfo);
                        } else {
                            void navigate(`/capsules?slug=${capsuleInfo}`);
                        }
                        
                    }}
                    className="mx-auto flex w-full min-w-2xs flex-col gap-1.5 p-6 bg-[#F2F1ED]"
                >
                    방 입장하기
                </Button>
            </div>
        </PageLayout>
    );
}
