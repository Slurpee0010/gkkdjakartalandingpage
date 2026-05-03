import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {installUseChatGptAiGuard} from './lib/useChatGptAiGuard';
import './index.css';

installUseChatGptAiGuard();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
