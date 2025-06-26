'use client'

interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
  properties?: Record<string, any>
}

class Analytics {
  private enabled: boolean = false

  constructor() {
    this.enabled = process.env.NODE_ENV === 'production'
  }

  private track(event: AnalyticsEvent) {
    if (!this.enabled) {
      console.log('Analytics (dev):', event)
      return
    }

    // In production, send to your analytics service
    // Example for Google Analytics 4:
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameters: event.properties
      })
    }

    // Example for custom analytics service:
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    }).catch(err => console.error('Analytics error:', err))
  }

  // Banner generation events
  bannerGenerationStarted(lob: string, theme: string, language: string) {
    this.track({
      action: 'banner_generation_started',
      category: 'banner',
      properties: { lob, theme, language }
    })
  }

  bannerGenerationCompleted(lob: string, bannerCount: number, duration: number) {
    this.track({
      action: 'banner_generation_completed',
      category: 'banner',
      value: duration,
      properties: { lob, bannerCount }
    })
  }

  bannerDownloaded(bannerType: string, lob: string) {
    this.track({
      action: 'banner_downloaded',
      category: 'banner',
      label: bannerType,
      properties: { lob }
    })
  }

  bannerRemixed(bannerType: string) {
    this.track({
      action: 'banner_remixed',
      category: 'banner',
      label: bannerType
    })
  }

  // User interaction events
  dropdownChanged(dropdownType: string, value: string) {
    this.track({
      action: 'dropdown_changed',
      category: 'interaction',
      label: dropdownType,
      properties: { value }
    })
  }

  bannerModalOpened(bannerType: string) {
    this.track({
      action: 'banner_modal_opened',
      category: 'interaction',
      label: bannerType
    })
  }

  // Error events
  error(errorType: string, message: string, context?: Record<string, any>) {
    this.track({
      action: 'error',
      category: 'error',
      label: errorType,
      properties: { message, ...context }
    })
  }
}

export const analytics = new Analytics()

// React hook for analytics
export function useAnalytics() {
  return analytics
}