import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import PrivacyPolicy from './PrivacyPolicy'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/datenschutz" element={<PrivacyPolicy />} />
    </Routes>
  </StrictMode>,
)
