import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "../types/AuthTypes";
import type { AuthUserDTO } from "../types/UserDTO";

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: AuthUserDTO;
        token: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: action.payload.user,
          token: action.payload.token,
          refreshToken: action.payload.refreshToken,
        })
      );
    },
    loadCredentialsFromStorage: (state) => {
        const stored = localStorage.getItem("auth");
        if(stored){
            const {user, token, refreshToken} = JSON.parse(stored);
            state.user = user;
            state.token = token;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;
        }
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("auth");
    },
  },
});

export const { setCredentials, loadCredentialsFromStorage, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
