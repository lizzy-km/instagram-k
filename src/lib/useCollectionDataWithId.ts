import { useCollectionData } from "react-firebase-hooks/firestore";
import type { DocumentData, Query } from "firebase/firestore";

/**
 * react-firebase-hooks@5.1.1's shipped types omit `idField` from
 * useCollectionData's options even though it's supported at runtime.
 * This wraps it with the option cast isolated in one place.
 */
export function useCollectionDataWithId<T extends { id: string }>(query: Query<DocumentData> | null | undefined) {
  const [data, loading, error, snapshot] = useCollectionData(query, { idField: "id" } as never);
  return [data as T[] | undefined, loading, error, snapshot] as const;
}
