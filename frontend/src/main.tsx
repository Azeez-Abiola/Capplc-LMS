import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

// NOTE: StrictMode intentionally removed to prevent double-mount of
// Supabase auth listeners, which causes "Lock broken by steal" errors.
// Re-enable once auth is stable: wrap <App /> with <StrictMode>

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Toaster 
      position="top-right" 
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#333',
        },
      }}
    />
    <App />
  </BrowserRouter>,
)
