'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8 max-w-lg">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            Something went wrong
          </h2>
          <p className="text-muted-foreground">
            We encountered an error while loading the 3D portfolio. 
            This might be due to browser compatibility or network issues.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
          
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">If the problem persists, try:</p>
            <ul className="space-y-1 text-left">
              <li>• Refreshing the page</li>
              <li>• Using a modern browser (Chrome, Firefox, Safari)</li>
              <li>• Enabling WebGL in your browser settings</li>
              <li>• Disabling browser extensions that might block WebGL</li>
            </ul>
          </div>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <details className="text-sm">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                Technical Details
              </summary>
              <pre className="mt-2 text-xs text-left overflow-auto">
                {error.message}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}