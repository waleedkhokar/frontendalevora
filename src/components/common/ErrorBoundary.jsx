// src/components/common/ErrorBoundary.jsx
import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">Please refresh the page or try again</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;