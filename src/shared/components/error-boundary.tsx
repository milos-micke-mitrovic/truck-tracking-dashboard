import { Component, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/shared/ui'
import { H2, Body } from '@/shared/ui/typography'

type ErrorFallbackProps = {
  error: Error | null
  onRetry: () => void
}

function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  const { t } = useTranslation('common')

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <H2 className="mb-2">{t('errorBoundary.title')}</H2>
      <Body color="muted" className="mb-6 max-w-md">
        {t('errorBoundary.message')}
      </Body>
      <Button onClick={onRetry} prefixIcon={<RefreshCw className="h-4 w-4" />}>
        {t('errorBoundary.retry')}
      </Button>
      {import.meta.env.DEV && error && (
        <pre className="mt-6 p-4 bg-muted rounded-lg text-left text-xs overflow-auto max-w-full">
          {error.message}
          {'\n'}
          {error.stack}
        </pre>
      )}
    </div>
  )
}

type ErrorBoundaryProps = {
  children: ReactNode
  fallback?: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />
    }

    return this.props.children
  }
}
