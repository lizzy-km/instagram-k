// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const token = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://strong-jay-59.clerk.accounts.dev/v1",
  }),

  tagTypes: ["auth"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (user) => ({
        url: "/sign-up",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["auth"],
    }),

    login: builder.mutation({
      query: (user) => ({
        url: "/sign-in",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["auth"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/user-logout",
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    Environment: builder.query({
      query: () => ({
        url: "/dev_browser",
        method: "POST",
        // body: data,
        headers: { Authorization: `Bearer ${token}` },
      }),
      providesTags: ["auth"],
    }),

    getPost: builder.query({
      query: (page) => ({
        url: `/contact?page=${page}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),

      providesTags: ["auth"],
    }),
    getUserPost: builder.query({
      query: (name) => ({
        url: `/contact?originalArgs=${name}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),

      providesTags: ["auth"],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useRegisterMutation,
  useLoginMutation,
  useLazyEnvironmentQuery,
  useGetPostQuery,
  useLogoutMutation,
  useDeletePostMutation,
  useGetUserPostQuery,
} = authApi;
