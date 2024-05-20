import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const TvApi = createApi({
  reducerPath: "m3u8Api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://raw.githubusercontent.com/lizzy-km/instagram-k/blob/d99b2ee3b929f3afbed6237f83defd6b3a37ee27/src/Watch/tv.json" }), // Replace with your m3u8 playlist URL
  endpoints: (builder) => ({
    getPlaylistData: builder.query({
      query: () => "",
      transformResponse: (response) => {
        
      },
      onError: (error) => {
        console.error("Error fetching playlist data:", error);
      },
    }),
  }),
});

export const { useGetPlaylistDataQuery } = TvApi;
