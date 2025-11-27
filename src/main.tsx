import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ModalProvider } from '@/context/ModalContext'
import { UploadProvider } from "@/context/UploadContext";
import { router } from './router'
import './styles/global.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ModalProvider>
        <UploadProvider>
          <RouterProvider router={router} />
        </UploadProvider>
      </ModalProvider>
    </AuthProvider>
  </StrictMode>,
)