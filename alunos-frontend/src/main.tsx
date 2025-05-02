import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { Toaster } from "@/components/ui/toaster"; // ✅ Novo import conforme estrutura atualizada

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster /> {/* Novo toaster, não usa mais ToastProvider */}
  </StrictMode>,
);
