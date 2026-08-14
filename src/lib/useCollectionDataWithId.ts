import { useMemo } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import type { DocumentData, Query } from "firebase/firestore";

/**
 * react-firebase-hooks@5.1.1's useCollectionData never attaches the
 * document ID to the returned objects (its `idField` option is
 * documented but not implemented at runtime - it just calls
 * `doc.data()`). This hook uses the lower-level useCollection instead
 * and merges each snapshot's `.id` in ourselves, optionally under a
 * different key when the doc already has a real field named `id`.
 */
export function useCollectionDataWithId<T extends { id: string }>(
  query: Query<DocumentData> | null | undefined,
  idField = "id"
) {
  const [snapshot, loading, error] = useCollection(query);

  const data = useMemo(() => {
    return snapshot?.docs.map((d) => ({ ...(d.data() as DocumentData), [idField]: d.id }) as T);
  }, [snapshot, idField]);

  return [data, loading, error, snapshot] as const;
}
