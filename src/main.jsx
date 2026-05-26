import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import { AuthProvider } from './context/AuthContext'
import { BuyerProvider } from './context/BuyerContext'
import { OwnerPropertiesProvider } from './context/OwnerPropertiesContext'
import { ThemeProvider } from './context/ThemeContext'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <OwnerPropertiesProvider>
            <BuyerProvider>
              <App />
            </BuyerProvider>
          </OwnerPropertiesProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
