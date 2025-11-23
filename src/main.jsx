import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // 如果沒有 CSS 檔，這行可以拿掉，但留著通常沒事

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
