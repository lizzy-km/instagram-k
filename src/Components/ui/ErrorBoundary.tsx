import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { EmptyState } from "./EmptyState";
import { Button } from "./Button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled error in subtree:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <EmptyState
          title="Something went wrong"
          description="This section failed to load. Try refreshing the page."
          action={
            <Button onClick={() => this.setState({ error: null })} variant="secondary">
              Try again
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}
