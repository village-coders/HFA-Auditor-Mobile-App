import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { useAuthStore } from '@/store/authStore'

// Check for stored tokens and attempt session restoration
const storedTokens = (() => {
  try {
    const tokensRaw = localStorage.getItem('auth_tokens') || sessionStorage.getItem('auth_tokens');
    if (tokensRaw) {
      const tokens = JSON.parse(tokensRaw);
      if (tokens?.expiresAt && tokens.expiresAt > Date.now()) {
        return tokens;
      }
    }
  } catch {
    // Invalid stored data
  }
  return null;
})();

// If we have valid tokens, set initial auth state to trigger loading screen
// The App component will call restoreSession() via useEffect
if (storedTokens) {
  useAuthStore.setState({ isLoading: true });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
