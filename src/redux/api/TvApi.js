import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Parser } from "m3u8-parser";

export const TvApi = createApi({
  reducerPath: "m3u8Api",
  baseQuery: fetchBaseQuery({ baseUrl: "/src/Watch/tv.json" }), // Replace with your m3u8 playlist URL
  endpoints: (builder) => ({
    getPlaylistData: builder.query({
      query: () => "",
      transformResponse: (response) => {
        // const playlist = Parser.parse(response.data);
        return response;
      },
      onError: (error) => {
        console.error("Error fetching playlist data:", error);
      },
    }),
  }),
});

export const { useGetPlaylistDataQuery } = TvApi;
