import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";

// 타입이 정의된 hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);

// 편의 hooks - 일단 user만
export const useUser = () => {
  return useAppSelector((state) => state.user);
};
