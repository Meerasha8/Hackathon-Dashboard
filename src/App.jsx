import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CompletedPage from './pages/CompletedPage'
import CreateHackathonPage from './pages/CreateHackathonPage'
import HackathonDetailPage from './pages/HackathonDetailPage'
import CalendarPage from './pages/CalendarPage'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black grid-bg">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1C2333',
              color: '#F0F4FF',
              border: '1px solid #1E2A3A',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#1D6AEB', secondary: '#F0F4FF' } },
            error: { iconTheme: { primary: '#E5303A', secondary: '#F0F4FF' } },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout><DashboardPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/completed" element={
            <ProtectedRoute>
              <Layout><CompletedPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/hackathons/new" element={
            <ProtectedRoute>
              <Layout><CreateHackathonPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/hackathons/:id" element={
            <ProtectedRoute>
              <Layout><HackathonDetailPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <Layout><CalendarPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
