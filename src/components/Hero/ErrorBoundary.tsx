'use client'
import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('3D Scene Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center h-full bg-black/90 text-white">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-white/20 flex items-center justify-center">
                <span className="text-lg">✦</span>
              </div>
              <p className="text-sm font-light tracking-[0.3em] uppercase">
                3D Experience Unavailable
              </p>
            </div>
          </div>
        )
      )
    }
    return this.props.children
  }
}
