import { useState } from "react";

interface ServerResponseProps {
  success: boolean;
  message?: string | Error;
}

interface ResponsePorps {
  url: string;
  method: string;
  headers: HeadersInit;
  body?: BodyInit;
}

export const useServerRequest = ({
  url,
  method,
  headers,
  body,
}: ResponsePorps) => {
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = async (
    inputValue: string
  ): Promise<ServerResponseProps | null> => {
    if (!inputValue) {
      alert("값을 입력해주세요!");
      return null;
    }

    setIsLoading(true);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
      });

      const result = (await response.json()) as ServerResponseProps;
      return result;

    } catch (error) {
      console.error(error);
      return { success: false, message: "서버 처리에 실패했습니다." };
    
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, sendRequest };
};
