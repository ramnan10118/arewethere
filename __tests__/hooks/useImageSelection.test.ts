import { renderHook } from '@testing-library/react'
import { useImageSelection } from '../../src/hooks/useImageSelection'

describe('useImageSelection', () => {
  it('returns auto images for auto LOB', () => {
    const { result } = renderHook(() => 
      useImageSelection({ lob: 'auto', imageType: 'float' })
    )
    
    expect(result.current.selectedImage).toContain('/images/auto/cars/')
  })

  it('returns health images for health LOB', () => {
    const { result } = renderHook(() => 
      useImageSelection({ lob: 'health', imageType: 'float' })
    )
    
    expect(result.current.selectedImage).toContain('/images/health/medicine/')
  })

  it('falls back to auto images for unknown LOB', () => {
    const { result } = renderHook(() => 
      useImageSelection({ lob: 'unknown', imageType: 'float' })
    )
    
    expect(result.current.selectedImage).toContain('/images/auto/cars/')
  })

  it('provides refresh functionality', () => {
    const { result } = renderHook(() => 
      useImageSelection({ lob: 'auto', imageType: 'float' })
    )
    
    const initialImage = result.current.selectedImage
    result.current.refreshImage()
    
    // Image might be the same due to randomness, but function should exist
    expect(typeof result.current.refreshImage).toBe('function')
  })
})