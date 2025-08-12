import { configureStore, type EnhancedStore } from "@reduxjs/toolkit";
import { authApi } from "./features/authApi";
import authReducer from './features/authSlice';
import { userApi } from "./features/user/userApi";
import { freelancerApi } from "./features/profile/freelancerApi";
import { jobCategoriesApi } from "./features/jobs/jobCategoriesApi";
import { languagesApi } from "./features/languages/languagesApi";
import { customerApi } from "./features/profile/customerApi";

export const store: EnhancedStore = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [jobCategoriesApi.reducerPath]: jobCategoriesApi.reducer,
        [languagesApi.reducerPath]: languagesApi.reducer,
        [freelancerApi.reducerPath]: freelancerApi.reducer,
        [customerApi.reducerPath]: customerApi.reducer,

    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
    .concat(authApi.middleware)
    .concat(userApi.middleware)
    .concat(jobCategoriesApi.middleware)
    .concat(languagesApi.middleware)
    .concat(freelancerApi.middleware)
    .concat(customerApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;