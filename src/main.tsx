import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ModalProvider } from '@/context/ModalContext'
import { UploadProvider } from "@/context/UploadContext";
import { LoadingProvider } from "@/context/LoadingContext";

import { router } from './router'
import './styles/global.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ModalProvider>
        <UploadProvider>
          <LoadingProvider>
            <RouterProvider router={router} />
          </LoadingProvider>
        </UploadProvider>
      </ModalProvider>
    </AuthProvider>
  </StrictMode>,
)