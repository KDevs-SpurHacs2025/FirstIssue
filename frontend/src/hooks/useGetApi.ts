import { useState } from "react";

export const useGetApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const get = async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 실제 서버 호출 - 환경 변수 사용
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
      const response = await fetch(`${apiBaseUrl}/api${url}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get data";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { get, isLoading, error };
};
