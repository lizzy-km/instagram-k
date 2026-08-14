import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const retryable = (error as { retryable?: boolean } | null)?.retryable ?? false;
        return retryable && failureCount < 2;
      },
      staleTime: 30_000,
    },
  },
});
