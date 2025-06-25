import { useState } from "react";

export const usePostApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const post = async <T = unknown>(
    url: string,
    data: Record<string, unknown>
  ): Promise<T> => {
    setIsLoading(true);
    setError(null);

    try {
      // 실제 서버 호출 - 환경 변수 사용
      const apiBaseUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
      const response = await fetch(`${apiBaseUrl}/api${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to post data";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { post, isLoading, error };
};
