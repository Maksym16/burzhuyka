import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Home from './pages/Home'

const Catalog        = lazy(() => import('./pages/Catalog'))
const ProductPage    = lazy(() => import('./pages/ProductPage'))
const Gallery        = lazy(() => import('./pages/Gallery'))
const Contacts       = lazy(() => import('./pages/Contacts'))
const PrivacyPolicy  = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const AdminLogin     = lazy(() => import('./pages/admin/Login'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error.status === 401) {
        localStorage.removeItem('admin_token')
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login'
        }
      }
    },
  }),
})

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-forge-black" />
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  return (
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<div className="min-h-screen bg-forge-black" />}>
            <Routes>
              <Route path="/"         element={<Home />} />
              <Route path="/catalog"  element={<Catalog />} />
              <Route path="/catalog/:slug" element={<ProductPage />} />
              <Route path="/gallery"  element={<Gallery />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/polityka-konfidencijnosti" element={<PrivacyPolicy />} />
              <Route path="/umovy-nadannia-posluh" element={<TermsOfService />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
    </HelmetProvider>
  )
}
