import { configureStore, type EnhancedStore } from "@reduxjs/toolkit";
import { authApi } from "./features/authApi";
import authReducer from './features/authSlice';

export const store: EnhancedStore = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
    .concat(authApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;