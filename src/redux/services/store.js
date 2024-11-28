import {
  configureStore,
  createSerializableStateInvariantMiddleware,
} from "@reduxjs/toolkit";
import { authApi } from "../api/AuthApi";
import authSlice from "./authSlice";
import animateSlice from "./animateSlice";
import { TvApi } from "../api/TvApi";
import { CollectionsApi } from "../api/CollectionsApis";

const nonSerializableMiddleware = createSerializableStateInvariantMiddleware();

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [authApi.reducerPath]: authApi.reducer,
    [TvApi.reducerPath]: TvApi.reducer,
    [CollectionsApi.reducerPath]: CollectionsApi.reducer,

    authSlice: authSlice,
    animateSlice: animateSlice,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      TvApi.middleware,
      CollectionsApi.middleware,
      nonSerializableMiddleware
    ),
});
