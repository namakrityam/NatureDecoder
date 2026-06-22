import React from 'react'
import ReactDOM from 'react-dom/client'
import TessareactCompare from './TessareactCompare.jsx'
import './index.css'

// Expose a global function to render the comparison component
window.renderTessareactCompare = (beforeImage, afterImage, containerId) => {
  const container = document.getElementById(containerId)
  if (!container) {
    console.error(`Container with id "${containerId}" not found`)
    return
  }

  // Clear any existing content
  container.innerHTML = ''

  // Create a root and render the component
  const root = ReactDOM.createRoot(container)
  root.render(
    <React.StrictMode>
      <TessareactCompare 
        beforeImage={beforeImage} 
        afterImage={afterImage} 
      />
    </React.StrictMode>
  )
}

// Expose a function to unmount the component
window.unmountTessareactCompare = (containerId) => {
  const container = document.getElementById(containerId)
  if (container) {
    container.innerHTML = ''
  }
}

console.log('Tessareact Compare module loaded')