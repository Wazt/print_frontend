import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[60vh] p-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-[var(--ob-redl)] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-[var(--ob-red)]" size={28} />
            </div>
            <h2 className="font-['Syne'] text-xl font-bold text-[var(--ob-tx)] mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-[var(--ob-txm)] mb-6 leading-relaxed">
              An unexpected error occurred. Try refreshing the page or going back.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--ob-p)] text-white text-sm font-semibold hover:opacity-90 transition"
              >
                <RefreshCw size={14} /> Try again
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--ob-brd2)] text-[var(--ob-txm)] text-sm font-medium hover:text-[var(--ob-tx)] transition"
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
