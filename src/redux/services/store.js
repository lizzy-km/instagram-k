import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/AuthApi";
import authSlice from "./authSlice";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [authApi.reducerPath]: authApi.reducer,

    authSlice: authSlice,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware
    ),
});
