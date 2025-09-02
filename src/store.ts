import { configureStore, type EnhancedStore } from "@reduxjs/toolkit";
import { authApi } from "./features/authApi";
import { userApi } from "./features/user/userApi";
import { freelancerApi } from "./features/profile/freelancerApi";
import { jobCategoriesApi } from "./features/jobs/jobCategoriesApi";
import { languagesApi } from "./features/languages/languagesApi";
import { customerApi } from "./features/profile/customerApi";
import { portfolioApi } from "./features/profile/portfolio/portfolioApi";
import { projectsApi } from "./features/projects/projectsApi";
import { persistedReducer } from "./rootReducer";
import { persistStore } from "redux-persist";

export const store: EnhancedStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
      serializableCheck: false, // redux-persist stores non-serializable stuff
    })
    .concat(authApi.middleware)
    .concat(userApi.middleware)
    .concat(jobCategoriesApi.middleware)
    .concat(languagesApi.middleware)
    .concat(freelancerApi.middleware)
    .concat(customerApi.middleware)
    .concat(portfolioApi.middleware)
    .concat(projectsApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;