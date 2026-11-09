import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  message: string
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error?.message || 'Error desconocido' }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Error capturado:', error, errorInfo.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="error-boundary"
          style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}
        >
          <h2>Algo salió mal</h2>
          <p>{this.state.message}</p>
          <button type="button" onClick={this.handleReset}>
            Reintentar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
