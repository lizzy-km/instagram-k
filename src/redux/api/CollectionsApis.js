import {  createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { collection, getDocs, query } from 'firebase/firestore'; // Import Firebase Firestore methods

const initialState = {
  collections: {}, // Object to store data from multiple collections
  loading: false,
  error: null,
};

export const CollectionsApi = createApi({
  reducerPath: 'collectionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }), // Adjust baseUrl if needed
  endpoints: (builder) => ({
    getCollections: builder.query({
      query: (collectionIds) => ({
        // Construct queries for each collection based on collectionIds array
        queries: collectionIds.map((collectionId) => ({
          queryFn: async (_, thunkAPI) => {
            const db = thunkAPI.getState().firebase.firestore;
            const collectionRef = collection(db, collectionId);
            const q = query(collectionRef);
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            return data;
          },
          provide: (result) => ({ collectionId, data: result }),
        })),
      }),
      // Set up a unique key based on the collectionIds array
      key: (_, { collectionIds }) => collectionIds.join('-'),
    }),
  }),
});

export const {useGetCollectionsQuery} = CollectionsApi
