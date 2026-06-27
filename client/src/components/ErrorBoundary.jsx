import { Component } from 'react';
import { Button } from './ui/Button.jsx';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="grid min-h-screen place-items-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold">Something needs a refresh</h1>
          <p className="mt-2 text-muted-foreground">Reload the page and the restaurant app will reconnect.</p>
          <Button className="mt-5" onClick={() => window.location.reload()}>Reload</Button>
        </div>
      </main>
    );
  }
}
