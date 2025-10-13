import React from 'react'
import ReactDOM from 'react-dom/client'
import liff from '@line/liff'
import App from './App.jsx'
import './index.css'

const LIFF_ID = import.meta.env.VITE_LIFF_ID
const LIFF_REDIRECT_URL = import.meta.env.VITE_LIFF_REDIRECT_URL

if (import.meta.env.VITE_MOCK) {
  async function msw() {
    const { worker } = await import('./mocks/browser')
    worker.start()
  }
  msw()
}

liff
  .init({
    liffId: LIFF_ID,
  })
  .then(() => {
    if (!liff.isLoggedIn()) {
      liff.login({
        redirectUri: import.meta.env.DEV
          ? 'https://localhost:5173'
          : LIFF_REDIRECT_URL,
      })
    } else {
      ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      )
    }
  })
  .catch((err) => {
    console.error(`LIFF init failed. Reason: ${err.message}`)
  })
