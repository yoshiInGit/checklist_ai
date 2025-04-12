import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomePage from './pages/HomePage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage.tsx'

const IS_DEV = false;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={IS_DEV ? "/" : "/works/checklist_ai/"}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
