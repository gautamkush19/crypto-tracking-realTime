import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RetryState } from './RetryState';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application boundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-error-shell">
          <RetryState
            title="Something slipped in the interface"
            message="Refresh the page to rebuild the session. Market data remains protected behind the API proxy."
            onRetry={() => window.location.reload()}
          />
        </main>
      );
    }

    return this.props.children;
  }
}
