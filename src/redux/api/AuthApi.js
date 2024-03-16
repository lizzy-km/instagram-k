// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const token = "4014|u4yp9RlCwObTqWeu9SoKIEnhAUXd90FsosqjEEYT";

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://contact-app.mmsdev.site/api/v1",
  }),

  tagTypes: ["auth"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (user) => ({
        url: "/register",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["auth"],
    }),

    login: builder.mutation({
      query: (user) => ({
        url: "/login",
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
    Contact: builder.mutation({
      query: (data) => ({
        url: "/contact",
        method: "POST",
        body: data,
        headers: { Authorization: `Bearer ${token}` },
      }),
      invalidatesTags: ["auth"],
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
  useContactMutation,
  useGetPostQuery,
  useLogoutMutation,
  useDeletePostMutation,
  useGetUserPostQuery,
} = authApi;
