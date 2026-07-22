import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './core/Home'
import AuthPage from './core/AuthPage'
import { getAuth } from './src/auth'

const ProtectedRoute = ({ children }) => (
  getAuth()?.token ? children : <Navigate to="/login" replace />
)

const MainRouter = () => (
  <Routes>
    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    <Route path="/login" element={getAuth()?.token ? <Navigate to="/" replace /> : <AuthPage mode="login" />} />
    <Route path="/register" element={getAuth()?.token ? <Navigate to="/" replace /> : <AuthPage mode="register" />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default MainRouter
