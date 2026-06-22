import React, { useState, useRef, useEffect, useCallback } from 'react'
import './TessareactCompare.css'

const TessareactCompare = ({ beforeImage, afterImage, onSlideChange }) => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)
  const dragRef = useRef(false)

  // Handle mouse/touch down on slider
  const handleDragStart = useCallback((e) => {
    e.preventDefault()
    dragRef.current = true
    setIsDragging(true)
  }, [])

  // Handle mouse/touch up
  const handleDragEnd = useCallback(() => {
    dragRef.current = false
    setIsDragging(false)
  }, [])

  // Handle mouse/touch move
  const handleDragMove = useCallback((e) => {
    if (!dragRef.current || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const position = ((clientX - rect.left) / rect.width) * 100
    const clampedPosition = Math.max(0, Math.min(100, position))
    
    setSliderPosition(clampedPosition)
    
    if (onSlideChange) {
      onSlideChange(clampedPosition)
    }
  }, [onSlideChange])

  // Handle click on container (not slider)
  const handleContainerClick = useCallback((e) => {
    if (e.target.closest('.tessareact-slider-handle') || isDragging) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const position = ((e.clientX - rect.left) / rect.width) * 100
    const clampedPosition = Math.max(0, Math.min(100, position))
    
    setSliderPosition(clampedPosition)
    
    if (onSlideChange) {
      onSlideChange(clampedPosition)
    }
  }, [isDragging, onSlideChange])

  // Add global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove)
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('touchmove', handleDragMove)
      window.addEventListener('touchend', handleDragEnd)
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchmove', handleDragMove)
      window.removeEventListener('touchend', handleDragEnd)
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  // If no images provided, show placeholder
  if (!beforeImage || !afterImage) {
    return (
      <div className="tessareact-container" ref={containerRef}>
        <div className="tessareact-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15L16 10L5 21" />
          </svg>
          <p>Upload images to compare</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`tessareact-container ${isDragging ? 'tessareact-dragging' : ''}`} 
      ref={containerRef}
      onClick={handleContainerClick}
      role="slider"
      aria-label="Image comparison slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin="0"
      aria-valuemax="100"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          setSliderPosition(prev => Math.max(0, prev - 5))
        } else if (e.key === 'ArrowRight') {
          setSliderPosition(prev => Math.min(100, prev + 5))
        }
      }}
    >
      {/* After Image (Background - Full) */}
      <div className="tessareact-image-layer tessareact-after">
        <img 
          src={afterImage} 
          alt="After" 
          draggable="false"
          className="tessareact-image"
        />
        <span className="tessareact-label tessareact-label-after">Product 2</span>
      </div>

      {/* Before Image (Foreground - Clipped) */}
      <div 
        className="tessareact-image-layer tessareact-before"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img 
          src={beforeImage} 
          alt="Before" 
          draggable="false"
          className="tessareact-image"
        />
        <span className="tessareact-label tessareact-label-before">Product 1</span>
      </div>

      {/* Slider Handle */}
      <div 
        className="tessareact-slider"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        role="separator"
      >
        <div className="tessareact-slider-line"></div>
        <div className="tessareact-slider-handle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M8 6L4 12L8 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 6L20 12L16 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default TessareactCompare