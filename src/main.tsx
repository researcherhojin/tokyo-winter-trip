import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { refreshDevelopmentPageOnRestore } from './lib/pageLifecycle'
if (import.meta.env.DEV) {
 const dispose = refreshDevelopmentPageOnRestore(window)
 import.meta.hot?.dispose(dispose)
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
