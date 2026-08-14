export class FirestoreOpError extends Error {
  readonly retryable: boolean;
  readonly cause?: unknown;

  constructor(message: string, options?: { retryable?: boolean; cause?: unknown }) {
    super(message);
    this.name = "FirestoreOpError";
    this.retryable = options?.retryable ?? false;
    this.cause = options?.cause;
  }
}

const RETRYABLE_FIRESTORE_CODES = new Set([
  "unavailable",
  "deadline-exceeded",
  "resource-exhausted",
  "aborted",
  "internal",
]);

export function toFirestoreOpError(error: unknown, message: string): FirestoreOpError {
  const code = (error as { code?: string } | null)?.code ?? "";
  const retryable = RETRYABLE_FIRESTORE_CODES.has(code.replace(/^firestore\//, ""));
  return new FirestoreOpError(message, { retryable, cause: error });
}
