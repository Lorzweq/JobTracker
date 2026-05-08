import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // Optionally log to an external service here
    // console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: "system-ui, Arial", color: "#b91c1c" }}>
          <h2>Something went wrong</h2>
          <div style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>
            {this.state.error && String(this.state.error)}
          </div>
          {this.state.info && (
            <pre style={{ marginTop: 12, background: "#f8f8f8", padding: 12, overflow: "auto" }}>
              {this.state.info.componentStack}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
