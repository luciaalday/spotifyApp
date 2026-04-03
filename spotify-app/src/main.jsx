import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/index.css';
import './assets/navigation.css';
import './assets/defaults.css';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
