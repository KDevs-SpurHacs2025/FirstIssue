import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  testUserId: string | null;
}

const initialState: UserState = {
  testUserId: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setTestUserId: (state, action: PayloadAction<string>) => {
      state.testUserId = action.payload;
    },
    clearUser: (state) => {
      state.testUserId = null;
    },
  },
});

export const { setTestUserId, clearUser } = userSlice.actions;
export default userSlice.reducer;
